import express from "express";
import cors from "cors";
import bcrypt from "bcrypt";
import { createServer } from "http";
import { Server } from "socket.io";
import { insertNewUser } from "./insertUser.js"; // MongoDB insertion function
import { 
  addUserToWaitingList, 
  removeUserFromWaitingList, 
  findBestMatch, 
  createMatchedRoom,
  removeMatchedRoom,
  cleanupOldWaitingUsers
} from "./userMatching.js";

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use(express.json()); // parses JSON body

// Clean up old waiting users every 10 minutes
setInterval(cleanupOldWaitingUsers, 10 * 60 * 1000);

// This is the route your React form hits
app.post("/api/register", async (req, res) => {
  try {
    const result = await insertNewUser(req.body); // req.body is your formData
    res.status(201).json({ message: "User registered", id: result.insertedId });
  } catch (err) {
    if (err.code === 11000 && err.keyPattern && err.keyPattern.email) {
      res.status(400).json({ message: "This email is already registered." });
    } else {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  }
});

app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const db = client.db("UserData");
    const users = db.collection("users");

    const user = await users.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    res.json({ message: "Login successful", id: user._id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // User joins a room
  socket.on('join-room', async (data) => {
    const { roomId, userData } = data;
    const userId = socket.id;
    
    console.log(`\n=== USER JOINING ROOM ===`);
    console.log(`User: ${userData.name} (${userData.email})`);
    console.log(`Socket ID: ${userId}`);
    console.log(`Room ID: ${roomId}`);
    console.log(`Tech Interest: ${userData.techInterest}`);
    console.log(`Practice Goals: ${userData.practiceGoals}`);
    
    try {
      // Store user data in MongoDB
      const userInfo = {
        socketId: socket.id,
        roomId,
        ...userData,
        joinedAt: new Date()
      };

      console.log(`Adding user to waiting list...`);
      // Add to waiting users in database
      await addUserToWaitingList(userInfo);
      console.log(`✅ User added to waiting list successfully`);
      
      // Check how many users are waiting in this room
      const waitingCount = await getWaitingUsersCount(roomId);
      console.log(`📊 Total users waiting in room ${roomId}: ${waitingCount}`);
      
      // Try to match existing waiting users with this new user
      console.log(`🔍 Looking for matches...`);
      setTimeout(async () => {
        await matchExistingUsers(roomId);
      }, 100); // Small delay to ensure socket connection is stable
    } catch (error) {
      console.error('❌ Error joining room:', error);
      socket.emit('error', { message: 'Failed to join room' });
    }
  });

  // User leaves room
  socket.on('leave-room', async (roomId) => {
    const userId = socket.id;
    console.log(`User ${userId} leaving room ${roomId}`);
    
    try {
      // Remove from waiting users in database
      await removeUserFromWaitingList(userId);
      
      // Notify other users in the room
      socket.to(roomId).emit('user-left', userId);
      
      // Clean up matched room if it exists
      await removeMatchedRoom(roomId);
    } catch (error) {
      console.error('Error leaving room:', error);
    }
  });

  // WebRTC signaling
  socket.on('offer', (data) => {
    const { targetUserId, offer } = data;
    console.log(`📤 Forwarding offer from ${socket.id} to ${targetUserId}`);
    socket.to(targetUserId).emit('offer', {
      userId: socket.id,
      offer
    });
  });

  socket.on('answer', (data) => {
    const { targetUserId, answer } = data;
    console.log(`📤 Forwarding answer from ${socket.id} to ${targetUserId}`);
    socket.to(targetUserId).emit('answer', {
      userId: socket.id,
      answer
    });
  });

  socket.on('ice-candidate', (data) => {
    const { targetUserId, candidate } = data;
    console.log(`🧊 Forwarding ICE candidate from ${socket.id} to ${targetUserId}`);
    socket.to(targetUserId).emit('ice-candidate', {
      userId: socket.id,
      candidate
    });
  });

  // Chat messages
  socket.on('chat-message', (message) => {
    // Broadcast to all users in the same room
    socket.broadcast.emit('chat-message', {
      ...message,
      sender: message.sender || 'Unknown'
    });
  });

  // Handle disconnect
  socket.on('disconnect', async () => {
    const userId = socket.id;
    console.log('User disconnected:', userId);
    
    try {
      // Remove from waiting users in database
      await removeUserFromWaitingList(userId);
      
      // Notify other users
      socket.broadcast.emit('user-left', userId);
    } catch (error) {
      console.error('Error handling disconnect:', error);
    }
  });
});

// Helper function to get waiting users count
async function getWaitingUsersCount(roomId) {
  try {
    const db = await connectToDB();
    const waitingUsers = db.collection("waitingUsers");
    const count = await waitingUsers.countDocuments({ roomId, status: 'waiting' });
    return count;
  } catch (error) {
    console.error('Error getting waiting users count:', error);
    return 0;
  }
}

// Matching algorithm using MongoDB data
async function findMatch(userId, roomId) {
  try {
    console.log(`\n🔍 FINDING MATCH FOR USER ${userId} IN ROOM ${roomId}`);
    
    // Get current user from database
    const currentUser = await getUserFromWaitingList(userId);
    if (!currentUser) {
      console.log(`❌ User ${userId} not found in waiting list`);
      return;
    }

    console.log(`✅ Current user found: ${currentUser.name}`);

    // Find best match using database
    const bestMatch = await findBestMatch(currentUser, roomId);
    
    if (!bestMatch) {
      console.log(`❌ No matches found for user ${currentUser.name} in room ${roomId}`);
      console.log(`💡 This could mean:`);
      console.log(`   - No other users in the same room`);
      console.log(`   - No compatible users (compatibility score too low)`);
      console.log(`   - All other users already matched`);
      return;
    }

    console.log(`🎉 MATCH FOUND!`);
    console.log(`   ${currentUser.name} ↔ ${bestMatch.name}`);
    console.log(`   Compatibility Score: ${bestMatch.score}`);
    console.log(`   Tech Interest Match: ${currentUser.techInterest} === ${bestMatch.techInterest}`);
    
    // Create a matched room in database
    await createMatchedRoom(currentUser, bestMatch);
    console.log(`✅ Matched room created in database`);
    
    // Remove both users from waiting list
    await removeUserFromWaitingList(userId);
    await removeUserFromWaitingList(bestMatch.socketId);
    console.log(`✅ Both users removed from waiting list`);
    
    // Notify both users about the match
    console.log(`📡 Sending match notifications...`);
    
    // Send match notification to current user (the one who just joined)
    io.to(userId).emit('user-matched', {
      id: bestMatch.socketId,
      name: bestMatch.name,
      techInterest: bestMatch.techInterest,
      practiceGoals: bestMatch.practiceGoals,
      university: bestMatch.university,
      year: bestMatch.year
    });
    console.log(`✅ Match notification sent to ${currentUser.name} (${userId})`);
    
    // Send match notification to the matched user
    io.to(bestMatch.socketId).emit('user-matched', {
      id: userId,
      name: currentUser.name,
      techInterest: currentUser.techInterest,
      practiceGoals: currentUser.practiceGoals,
      university: currentUser.university,
      year: currentUser.year
    });
    console.log(`✅ Match notification sent to ${bestMatch.name} (${bestMatch.socketId})`);
    
    console.log(`✅ Match notifications sent to both users`);
    
  } catch (error) {
    console.error('❌ Error in findMatch:', error);
  }
}

// Helper function to get user from waiting list
async function getUserFromWaitingList(socketId) {
  const db = await connectToDB();
  const waitingUsers = db.collection("waitingUsers");
  
  try {
    const user = await waitingUsers.findOne({ socketId });
    return user;
  } catch (error) {
    console.error('Error fetching user from waiting list:', error);
    return null;
  }
}

// Function to match existing waiting users when a new user joins
async function matchExistingUsers(roomId) {
  try {
    console.log(`\n🔄 CHECKING FOR EXISTING MATCHES IN ROOM ${roomId}`);
    
    const db = await connectToDB();
    const waitingUsers = db.collection("waitingUsers");
    
    // Get all waiting users in this room
    const users = await waitingUsers.find({ roomId, status: 'waiting' }).toArray();
    console.log(`📊 Found ${users.length} waiting users in room ${roomId}`);
    
    // Debug: Log all users found
    users.forEach((user, index) => {
      console.log(`   User ${index + 1}: ${user.name} (${user.socketId}) - Status: ${user.status}`);
    });
    
    if (users.length < 2) {
      console.log(`❌ Not enough users to match (need at least 2)`);
      return;
    }
    
    // Try to find the best match among all waiting users
    let bestMatch = null;
    let bestScore = 0;
    let bestUser1 = null;
    let bestUser2 = null;
    
    for (let i = 0; i < users.length; i++) {
      for (let j = i + 1; j < users.length; j++) {
        const user1 = users[i];
        const user2 = users[j];
        
        // Calculate compatibility score
        const score = calculateCompatibilityScore(user1, user2);
        console.log(`   ${user1.name} ↔ ${user2.name}: ${score} points`);
        
        if (score > bestScore && score > 20) { // Minimum compatibility threshold
          bestScore = score;
          bestUser1 = user1;
          bestUser2 = user2;
        }
      }
    }
    
    if (bestUser1 && bestUser2) {
      console.log(`🏆 Best match found: ${bestUser1.name} ↔ ${bestUser2.name} (${bestScore} points)`);
      
      // Create matched room
      await createMatchedRoom(bestUser1, bestUser2);
      console.log(`✅ Matched room created in database`);
      
      // Remove both users from waiting list
      await removeUserFromWaitingList(bestUser1.socketId);
      await removeUserFromWaitingList(bestUser2.socketId);
      console.log(`✅ Both users removed from waiting list`);
      
      // Notify both users
      console.log(`📡 Sending match notifications...`);
      
      // Notify user1 about user2
      console.log(`📤 Sending match notification to ${bestUser1.name} (${bestUser1.socketId})`);
      io.to(bestUser1.socketId).emit('user-matched', {
        id: bestUser2.socketId,
        name: bestUser2.name,
        techInterest: bestUser2.techInterest,
        practiceGoals: bestUser2.practiceGoals,
        university: bestUser2.university,
        year: bestUser2.year
      });
      console.log(`✅ Match notification sent to ${bestUser1.name} (${bestUser1.socketId})`);
      
      // Notify user2 about user1
      console.log(`📤 Sending match notification to ${bestUser2.name} (${bestUser2.socketId})`);
      io.to(bestUser2.socketId).emit('user-matched', {
        id: bestUser1.socketId,
        name: bestUser1.name,
        techInterest: bestUser1.techInterest,
        practiceGoals: bestUser1.practiceGoals,
        university: bestUser1.university,
        year: bestUser1.year
      });
      console.log(`✅ Match notification sent to ${bestUser2.name} (${bestUser2.socketId})`);
      
      console.log(`✅ Match notifications sent to both users`);
    } else {
      console.log(`❌ No compatible matches found among existing users`);
    }
    
  } catch (error) {
    console.error('❌ Error in matchExistingUsers:', error);
  }
}

// Helper function to calculate compatibility score
function calculateCompatibilityScore(user1, user2) {
  let score = 0;
  
  // Tech interest match (40 points)
  if (user1.techInterest === user2.techInterest) {
    score += 40;
  }
  
  // Practice goals overlap (30 points max)
  const goals1 = user1.practiceGoals || [];
  const goals2 = user2.practiceGoals || [];
  const commonGoals = goals1.filter(goal => goals2.includes(goal));
  score += commonGoals.length * 10;
  
  // University match (20 points)
  if (user1.university === user2.university) {
    score += 20;
  }
  
  // Year match (10 points)
  if (user1.year === user2.year) {
    score += 10;
  }
  
  return score;
}

// Helper function to connect to database
async function connectToDB() {
  const { MongoClient } = await import("mongodb");
  const path = await import("path");
  const dotenv = await import("dotenv");
  
  dotenv.config({ path: path.resolve("../.env") });
  
  const client = new MongoClient(process.env.MONGO_URI);
  await client.connect();
  return client.db("UserData");
}

server.listen(3000, () => console.log("Server running on port 3000"));
