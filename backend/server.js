import express from "express";
import cors from "cors";
import bcrypt from "bcrypt";
import { insertNewUser } from "./insertUser.js"; // MongoDB insertion function
import { generateQuestionAudio } from "./interviewQuestion.js";

const app = express();
app.use(cors());
app.use(express.json());

// Register a new user
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

// User login
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

// Generate interview question
app.post("/api/genq", async (req, res) => {
  try {
    const result = await generateQuestionAudio();
    // send the result back to the client
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
});



app.listen(5000, () => console.log("Server running on port 5000"));
