// This file's only job: connect to our MongoDB Atlas database.
import dns from "node:dns";
import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const dnsServers = process.env.DNS_SERVERS?.split(",").map((server) => server.trim()).filter(Boolean);
    dns.setServers(dnsServers?.length ? dnsServers : ["1.1.1.1", "8.8.8.8"]);
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB connection failed: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
