import mongoose, { Mongoose } from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/express-mongoose";

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable inside .env.local");
}

// Define a global type for the cached connection
declare global {
  // Prevent TypeScript from redeclaring the global variable
  // Add this to avoid type conflicts in the global namespace
  var mongoose: { conn: Mongoose | null; promise: Promise<Mongoose> | null };
}

// Initialize the cached variable
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectToDatabase(): Promise<Mongoose> {
  // Return existing connection if available
  if (cached.conn) {
    return cached.conn;
  }

  // Create a new connection if none exists
  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
    });
  }

  // Await the connection promise and cache the connection
  cached.conn = await cached.promise;
  return cached.conn;
}

export default connectToDatabase;
