import express from "express";
import cors from "cors";
import { insertNewUser } from "./insertUser.js"; // MongoDB insertion function

const app = express();
app.use(cors());
app.use(express.json()); // parses JSON body

// This is the route your React form hits
app.post("/api/register", async (req, res) => {
  try {
    const result = await insertNewUser(req.body); // req.body is your formData
    res.status(201).json({ message: "User registered", id: result.insertedId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

app.listen(5000, () => console.log("Server running on port 5000"));
