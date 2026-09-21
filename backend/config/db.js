// This file's only job: connect to MongoDB, preferring Atlas but falling back to local dev when needed.
import dns from "node:dns";
import mongoose from "mongoose";

const connectDB = async () => {
  const configuredUri = process.env.MONGODB_URI || process.env.MONGO_URI;

  try {
    const dnsServers = process.env.DNS_SERVERS?.split(",").map((server) => server.trim()).filter(Boolean);
    dns.setServers(dnsServers?.length ? dnsServers : ["1.1.1.1", "8.8.8.8"]);

    const conn = await mongoose.connect(configuredUri || "mongodb://127.0.0.1:27017/tarang", {
      dbName: process.env.MONGO_DB_NAME || "tarang",
    });
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    if (configuredUri) {
      console.error(`MongoDB connection failed: ${error.message}`);
      process.exit(1);
    }

    try {
      const fallbackUri = "mongodb://127.0.0.1:27017/tarang";
      const conn = await mongoose.connect(fallbackUri);
      console.log(`MongoDB connected to local fallback: ${conn.connection.host}`);
    } catch (fallbackError) {
      console.error(`MongoDB connection failed: ${error.message}`);
      console.error(`Local Mongo fallback failed: ${fallbackError.message}`);
      process.exit(1);
    }
  }
};

export default connectDB;
