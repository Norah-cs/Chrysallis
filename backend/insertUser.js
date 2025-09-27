import path from "path";
import dotenv from 'dotenv';
import bcrypt from "bcrypt";
import { MongoClient } from "mongodb";

dotenv.config({ path: path.resolve("../.env") });

const client = new MongoClient(process.env.MONGO_URI);

export async function insertNewUser(formData) {
  try {
    await client.connect();

    const db = client.db("UserData");
    const coll = db.collection("users");

    await coll.createIndex({ email: 1 }, { unique: true });

    const hashedPassword = await bcrypt.hash(formData.password, 10);

    const result = await coll.insertOne({
      ...formData,
      password: hashedPassword
    });

    return result;
    
  } finally {
    await client.close();
  }
}
