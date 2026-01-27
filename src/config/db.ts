import { MongoClient, ServerApiVersion } from 'mongodb';

const uri = process.env.MONGO_URI as any;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

// Rename 'run' to 'connectDB' and export it
export const connectDB = async () => {
  try {
    await client.connect();
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
    return client;
  } catch (error) {
    console.error("MongoDB connection failed:", error);
    process.exit(1); // Stop the server if DB fails
  }
};