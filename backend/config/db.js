// Connect to MongoDB Atlas using environment variables only. No local fallback is allowed in production.
import dns from "node:dns";
import mongoose from "mongoose";

const connectDB = async () => {
  const configuredUri = process.env.MONGODB_URI || process.env.MONGO_URI;

  if (!configuredUri) {
    console.error("MongoDB connection string is missing. Set MONGO_URI or MONGODB_URI in your environment.");
    process.exit(1);
  }

  try {
    const dnsServers = process.env.DNS_SERVERS?.split(",").map((server) => server.trim()).filter(Boolean);
    dns.setServers(dnsServers?.length ? dnsServers : ["1.1.1.1", "8.8.8.8"]);

    const conn = await mongoose.connect(configuredUri, {
      dbName: process.env.MONGO_DB_NAME || "tarang",
    });
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB connection failed: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
