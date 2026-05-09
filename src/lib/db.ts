import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("Please define MONGODB_URI in .env.local");
}

type CachedConnection = { conn: typeof mongoose | null; promise: Promise<typeof mongoose> | null };

declare global {
  var mongooseConnection: CachedConnection | undefined;
}

const cached: CachedConnection = global.mongooseConnection ?? { conn: null, promise: null };
global.mongooseConnection = cached;

export async function connectDB() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(MONGODB_URI!, { bufferCommands: false, serverSelectionTimeoutMS: 8000 })
      .catch((error) => {
        cached.promise = null;
        throw error;
      });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}
