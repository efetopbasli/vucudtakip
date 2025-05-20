import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);
const dbName = "fitnessTracker";

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      await client.connect();
      const db = client.db(dbName);
      const { userId, date, day, progress, completed } = req.body;

      const result = await db.collection("dailyProgress").updateOne(
        { userId, date },
        { $set: { userId, date, day, progress, completed } },
        { upsert: true }
      );

      res.status(200).json({ success: true, result });
    } catch (err) {
      res.status(500).json({ error: err.message });
    } finally {
      await client.close();
    }
  } else {
    res.status(405).end();
  }
}
