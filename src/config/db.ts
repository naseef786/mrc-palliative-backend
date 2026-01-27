// lib/mongo.ts
import mongoose from "mongoose";

// Extend globalThis to include mongoose caching
declare global {
  // eslint-disable-next-line no-var
  var mongoose: { conn: mongoose.Mongoose | null; promise: Promise<mongoose.Mongoose> | null };
}

let cached = globalThis.mongoose;

if (!cached) {
  cached = globalThis.mongoose = { conn: null, promise: null };
}

export const connectDB = async () => {
  if (cached.conn) {
    console.log(`✅ MongoDB Atlas already connected: ${cached.conn.connection.host}`);
    return cached.conn;
  }

  if (!cached.promise) {
    const uri = process.env.MONGO_URI as string;
    if (!uri) throw new Error("MONGO_URI is not defined in environment variables");

    cached.promise = mongoose.connect(uri, {
      dbName: process.env.DB_NAME,
      serverSelectionTimeoutMS: 10000,
    }).then((mongoose) => {
      console.log(`✅ MongoDB Atlas connected: ${mongoose.connection.host}`);
      return mongoose;
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
};
