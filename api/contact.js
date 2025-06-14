// api/contact.js
import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI; // Make sure this is added to Vercel

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ message: "Missing fields" });
  }

  try {
    const client = new MongoClient(uri);
    await client.connect();
    const db = client.db("portfolio");
    const collection = db.collection("feedback");

    await collection.insertOne({ name, email, message, createdAt: new Date() });

    res.status(200).json({ message: "Feedback submitted!" });
    await client.close();
  } catch (err) {
    console.error("MongoDB Error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
}