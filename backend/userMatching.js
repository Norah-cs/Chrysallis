import path from "path";
import dotenv from 'dotenv';
import { MongoClient } from "mongodb";

dotenv.config({ path: path.resolve("../.env") });

// In-memory storage as fallback when MongoDB is unavailable
let inMemoryStorage = {
  waitingUsers: new Map(),
  matchedRooms: new Map(),
  users: new Map()
};

let client = null;
let useInMemory = false;

// Try to create MongoDB client, fall back to in-memory if it fails
try {
  if (process.env.MONGO_URI) {
    client = new MongoClient(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      maxPoolSize: 10,
      minPoolSize: 5,
      maxIdleTimeMS: 30000,
      connectTimeoutMS: 10000,
      retryWrites: true,
      retryReads: true,
    });
  } else {
    console.log('⚠️ No MONGO_URI found, using in-memory storage');
    useInMemory = true;
  }
} catch (error) {
  console.log('⚠️ MongoDB client creation failed, using in-memory storage:', error.message);
  useInMemory = true;
}

// Connect to MongoDB or return in-memory storage
async function connectToDB() {
  if (useInMemory) {
    return inMemoryStorage;
  }
  
  try {
    if (!client || !client.topology || !client.topology.isConnected()) {
      await client.connect();
    }
    return client.db("UserData");
  } catch (error) {
    console.error('Error connecting to MongoDB, switching to in-memory storage:', error.message);
    useInMemory = true;
    return inMemoryStorage;
  }
}

// Get user by email
export async function getUserByEmail(email) {
  const db = await connectToDB();
  if (!db) {
    console.error('Database connection failed');
    return null;
  }
  
  if (useInMemory) {
    return db.users.get(email) || null;
  }
  
  const users = db.collection("users");
  
  try {
    const user = await users.findOne({ email });
    return user;
  } catch (error) {
    console.error('Error fetching user by email:', error);
    return null;
  }
}

// Get users waiting in a specific room
export async function getWaitingUsersInRoom(roomId) {
  const db = await connectToDB();
  if (!db) {
    console.error('Database connection failed');
    return [];
  }
  
  if (useInMemory) {
    const users = Array.from(db.waitingUsers.values()).filter(user => 
      user.roomId === roomId && user.status === 'waiting'
    );
    return users;
  }
  
  const waitingUsers = db.collection("waitingUsers");
  
  try {
    const users = await waitingUsers.find({ 
      roomId: roomId,
      status: 'waiting'
    }).toArray();
    return users;
  } catch (error) {
    console.error('Error fetching waiting users:', error);
    return [];
  }
}

// Add user to waiting list
export async function addUserToWaitingList(userData) {
  const db = await connectToDB();
  if (!db) {
    console.error('Database connection failed, cannot add user to waiting list');
    return null;
  }
  
  console.log(`📝 Adding user to waiting list: ${userData.name} (${userData.socketId})`);
  
  if (useInMemory) {
    // Remove user if already waiting (in case of reconnection)
    if (db.waitingUsers.has(userData.socketId)) {
      console.log(`🗑️ Removed existing waiting user: ${userData.socketId}`);
    }
    
    // Add user to waiting list
    const userWithStatus = {
      ...userData,
      status: 'waiting',
      joinedAt: new Date()
    };
    
    db.waitingUsers.set(userData.socketId, userWithStatus);
    console.log(`✅ User added to waiting list (in-memory)`);
    
    // Verify the user was added
    const verifyUser = db.waitingUsers.get(userData.socketId);
    if (verifyUser) {
      console.log(`✅ Verification: User found in waiting list`);
    } else {
      console.log(`❌ Verification failed: User not found in waiting list`);
    }
    
    return { insertedId: userData.socketId };
  }
  
  const waitingUsers = db.collection("waitingUsers");
  
  try {
    // Remove user if already waiting (in case of reconnection)
    const deleteResult = await waitingUsers.deleteOne({ socketId: userData.socketId });
    if (deleteResult.deletedCount > 0) {
      console.log(`🗑️ Removed existing waiting user: ${userData.socketId}`);
    }
    
    // Add user to waiting list
    const result = await waitingUsers.insertOne({
      ...userData,
      status: 'waiting',
      joinedAt: new Date()
    });
    
    console.log(`✅ User added to waiting list with ID: ${result.insertedId}`);
    
    // Verify the user was added
    const verifyUser = await waitingUsers.findOne({ socketId: userData.socketId });
    if (verifyUser) {
      console.log(`✅ Verification: User found in waiting list`);
    } else {
      console.log(`❌ Verification failed: User not found in waiting list`);
    }
    
    return result;
  } catch (error) {
    console.error('❌ Error adding user to waiting list:', error);
    return null;
  }
}

// Remove user from waiting list
export async function removeUserFromWaitingList(socketId) {
  const db = await connectToDB();
  if (!db) {
    console.error('Database connection failed, cannot remove user from waiting list');
    return null;
  }
  
  if (useInMemory) {
    const existed = db.waitingUsers.has(socketId);
    if (existed) {
      db.waitingUsers.delete(socketId);
      console.log(`🗑️ Removed user from waiting list (in-memory): ${socketId}`);
    }
    return { deletedCount: existed ? 1 : 0 };
  }
  
  const waitingUsers = db.collection("waitingUsers");
  
  try {
    const result = await waitingUsers.deleteOne({ socketId });
    return result;
  } catch (error) {
    console.error('Error removing user from waiting list:', error);
    return null;
  }
}

// Create a matched room
export async function createMatchedRoom(user1Data, user2Data) {
  const db = await connectToDB();
  if (!db) {
    console.error('Database connection failed, cannot create matched room');
    return null;
  }
  
  const matchedRooms = db.collection("matchedRooms");
  
  try {
    const roomId = `${user1Data.socketId}-${user2Data.socketId}`;
    
    const result = await matchedRooms.insertOne({
      roomId,
      users: [user1Data, user2Data],
      status: 'active',
      createdAt: new Date()
    });
    
    return result;
  } catch (error) {
    console.error('Error creating matched room:', error);
    return null;
  }
}

// Remove matched room
export async function removeMatchedRoom(roomId) {
  const db = await connectToDB();
  if (!db) {
    console.error('Database connection failed, cannot remove matched room');
    return null;
  }
  
  const matchedRooms = db.collection("matchedRooms");
  
  try {
    const result = await matchedRooms.deleteOne({ roomId });
    return result;
  } catch (error) {
    console.error('Error removing matched room:', error);
    return null;
  }
}

// Get all users for matching (excluding current user)
export async function getPotentialMatches(currentUser, roomId) {
  const db = await connectToDB();
  if (!db) {
    console.error('Database connection failed, cannot get potential matches');
    return [];
  }
  
  if (useInMemory) {
    const users = Array.from(db.waitingUsers.values()).filter(user => 
      user.roomId === roomId && 
      user.status === 'waiting' && 
      user.socketId !== currentUser.socketId
    );
    return users;
  }
  
  const waitingUsers = db.collection("waitingUsers");
  
  try {
    const potentialMatches = await waitingUsers.find({
      roomId: roomId,
      status: 'waiting',
      socketId: { $ne: currentUser.socketId }
    }).toArray();
    
    return potentialMatches;
  } catch (error) {
    console.error('Error fetching potential matches:', error);
    return [];
  }
}

// Calculate compatibility score between two users
export function calculateCompatibilityScore(user1, user2) {
  let score = 0;
  
  // Tech interest match (40% weight)
  if (user1.techInterest === user2.techInterest) {
    score += 40;
  }
  
  // Practice goals overlap (30% weight)
  const commonGoals = user1.practiceGoals.filter(goal => 
    user2.practiceGoals.includes(goal)
  );
  if (user1.practiceGoals.length > 0 && user2.practiceGoals.length > 0) {
    score += (commonGoals.length / Math.max(user1.practiceGoals.length, user2.practiceGoals.length)) * 30;
  }
  
  // University similarity (10% weight)
  if (user1.university === user2.university && user1.university && user2.university) {
    score += 10;
  }
  
  // Year similarity (10% weight)
  if (user1.year === user2.year && user1.year && user2.year) {
    score += 10;
  }
  
  // Random factor for variety (10% weight)
  score += Math.random() * 10;
  
  return Math.round(score);
}

// Find best match for a user
export async function findBestMatch(currentUser, roomId) {
  try {
    console.log(`🔍 Finding best match for ${currentUser.name} in room ${roomId}`);
    
    const potentialMatches = await getPotentialMatches(currentUser, roomId);
    console.log(`📊 Found ${potentialMatches.length} potential matches`);
    
    if (potentialMatches.length === 0) {
      console.log(`❌ No potential matches found`);
      return null;
    }
    
    // Log all potential matches
    potentialMatches.forEach((match, index) => {
      console.log(`   Match ${index + 1}: ${match.name} (${match.techInterest})`);
    });
    
    // Calculate compatibility scores
    const matchesWithScores = potentialMatches.map(match => {
      const score = calculateCompatibilityScore(currentUser, match);
      console.log(`   ${currentUser.name} ↔ ${match.name}: ${score} points`);
      return { ...match, score };
    });
    
    // Sort by compatibility score (highest first)
    matchesWithScores.sort((a, b) => b.score - a.score);
    
    // Return the best match if score is above threshold
    const bestMatch = matchesWithScores[0];
    console.log(`🏆 Best match: ${bestMatch.name} with score ${bestMatch.score}`);
    
    if (bestMatch.score > 20) {
      console.log(`✅ Match accepted (score > 20)`);
      return bestMatch;
    } else {
      console.log(`❌ Match rejected (score too low: ${bestMatch.score} <= 20)`);
      return null;
    }
    
  } catch (error) {
    console.error('❌ Error finding best match:', error);
    throw error;
  }
}

// Clean up old waiting users (for maintenance)
export async function cleanupOldWaitingUsers() {
  const db = await connectToDB();
  if (!db) {
    console.error('Database connection failed, cannot cleanup old waiting users');
    return null;
  }
  
  if (useInMemory) {
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
    let deletedCount = 0;
    
    for (const [socketId, user] of db.waitingUsers.entries()) {
      if (user.joinedAt < fiveMinutesAgo) {
        db.waitingUsers.delete(socketId);
        deletedCount++;
      }
    }
    
    console.log(`Cleaned up ${deletedCount} old waiting users (in-memory)`);
    return { deletedCount };
  }
  
  const waitingUsers = db.collection("waitingUsers");
  
  try {
    // Remove users who have been waiting for more than 5 minutes
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
    const result = await waitingUsers.deleteMany({
      joinedAt: { $lt: fiveMinutesAgo }
    });
    
    console.log(`Cleaned up ${result.deletedCount} old waiting users`);
    return result;
  } catch (error) {
    console.error('Error cleaning up old waiting users:', error);
    return null;
  }
}
