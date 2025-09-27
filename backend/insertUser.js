import path from "path";
import dotenv from 'dotenv';
import { MongoClient } from "mongodb";

dotenv.config({ path: path.resolve("../.env") });

const client = new MongoClient(process.env.MONGO_URI);

export async function insertNewUser(formData) {
  try {
    await client.connect();

    const db = client.db("UserData");
    const coll = db.collection("users");


    const result = await coll.insertOne(formData);
    return result;
    
  } finally {
    await client.close();
  }
}
