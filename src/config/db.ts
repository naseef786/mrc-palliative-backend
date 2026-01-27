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
      // --- TIMEOUT UPDATES START HERE ---
      // How long to wait for the initial connection/discovery
      serverSelectionTimeoutMS: 30000, // Increased from 10k to 30k
      // How long to wait for a single socket operation
      socketTimeoutMS: 45000,
      // How often the driver checks the server status
      heartbeatFrequencyMS: 2000,
      // --- TIMEOUT UPDATES END HERE ---
    }).then((mongoose) => {
      console.log(`✅ MongoDB Atlas connected: ${mongoose.connection.host}`);
      return mongoose;
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
};
