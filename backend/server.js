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
    
    console.log(`User ${userData.name} joining room ${roomId}`);
    
    try {
      // Store user data in MongoDB
      const userInfo = {
        socketId: socket.id,
        roomId,
        ...userData,
        joinedAt: new Date()
      };

      // Add to waiting users in database
      await addUserToWaitingList(userInfo);
      
      // Try to find a match
      await findMatch(userId, roomId);
    } catch (error) {
      console.error('Error joining room:', error);
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
    socket.to(targetUserId).emit('offer', {
      userId: socket.id,
      offer
    });
  });

  socket.on('answer', (data) => {
    const { targetUserId, answer } = data;
    socket.to(targetUserId).emit('answer', {
      userId: socket.id,
      answer
    });
  });

  socket.on('ice-candidate', (data) => {
    const { targetUserId, candidate } = data;
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

// Matching algorithm using MongoDB data
async function findMatch(userId, roomId) {
  try {
    // Get current user from database
    const currentUser = await getUserFromWaitingList(userId);
    if (!currentUser) {
      console.log(`User ${userId} not found in waiting list`);
      return;
    }

    // Find best match using database
    const bestMatch = await findBestMatch(currentUser, roomId);
    
    if (!bestMatch) {
      console.log(`No matches found for user ${currentUser.name} in room ${roomId}`);
      return;
    }

    console.log(`Matching ${currentUser.name} with ${bestMatch.name} (score: ${bestMatch.score})`);
    
    // Create a matched room in database
    await createMatchedRoom(currentUser, bestMatch);
    
    // Remove both users from waiting list
    await removeUserFromWaitingList(userId);
    await removeUserFromWaitingList(bestMatch.socketId);
    
    // Notify both users about the match
    io.to(userId).emit('user-matched', {
      id: bestMatch.socketId,
      name: bestMatch.name,
      techInterest: bestMatch.techInterest,
      practiceGoals: bestMatch.practiceGoals,
      university: bestMatch.university,
      year: bestMatch.year
    });
    
    io.to(bestMatch.socketId).emit('user-matched', {
      id: userId,
      name: currentUser.name,
      techInterest: currentUser.techInterest,
      practiceGoals: currentUser.practiceGoals,
      university: currentUser.university,
      year: currentUser.year
    });
    
  } catch (error) {
    console.error('Error in findMatch:', error);
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
