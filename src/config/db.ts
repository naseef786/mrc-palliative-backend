import mongoose from "mongoose";
import { attachDatabasePool } from "@vercel/functions";

declare global {
  var mongoose: { conn: mongoose.Mongoose | null; promise: Promise<mongoose.Mongoose> | null };
}

let cached = global.mongoose;
if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export const connectDB = async () => {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    const uri = process.env.MONGO_URI as string;

    const opts = {
      dbName: process.env.DB_NAME,
      serverSelectionTimeoutMS: 30000,
      family: 4,
    };

    cached.promise = mongoose.connect(uri, opts).then((mongooseInstance) => {
      // --- VERCEL SPECIFIC POOLING ---
      // We get the underlying MongoDB driver client and "attach" it
      const client = mongooseInstance.connection.getClient();
      attachDatabasePool(client);
      // -------------------------------

      console.log("🚀 Connection pooled and active");
      return mongooseInstance;
    }).catch(err => {
      cached.promise = null;
      throw err;
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
};