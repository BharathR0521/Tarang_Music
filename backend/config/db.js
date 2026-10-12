// Connect the API to MongoDB before it starts accepting requests.
import dns from "node:dns";
import mongoose from "mongoose";

const connectDB = async () => {
  const configuredUri = process.env.MONGODB_URI || process.env.MONGO_URI;
  const isProduction = process.env.NODE_ENV === "production";

  if (isProduction && !configuredUri) {
    throw new Error("Set MONGO_URI (or MONGODB_URI) to your MongoDB Atlas connection string.");
  }

  const dnsServers = process.env.DNS_SERVERS?.split(",").map((server) => server.trim()).filter(Boolean);
  dns.setServers(dnsServers?.length ? dnsServers : ["1.1.1.1", "8.8.8.8"]);

  try {
    const conn = await mongoose.connect(configuredUri || "mongodb://127.0.0.1:27017/tarang", {
      dbName: process.env.MONGO_DB_NAME || "tarang",
    });
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    throw new Error(`MongoDB connection failed: ${error.message}`, { cause: error });
  }
};

export default connectDB;
