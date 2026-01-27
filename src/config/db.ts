import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI as string, {
      dbName: process.env.DEVELOPMENT_DB_NAME, // optional but recommended
    });

    console.log(`✅ MongoDB Atlas connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("❌ MongoDB connection error", error);
    process.exit(1);
  }
};
