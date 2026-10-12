// This is the starting point of the backend. Run it with: npm run dev
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import path from "node:path";
import { fileURLToPath } from "node:url";
import connectDB from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import songRoutes from "./routes/songRoutes.js";
import playlistRoutes from "./routes/playlistRoutes.js";
import commentRoutes from "./routes/commentRoutes.js";

dotenv.config({ path: path.join(path.dirname(fileURLToPath(import.meta.url)), ".env") });

const app = express();
app.set("trust proxy", 1);
const allowedOrigins = (process.env.CLIENT_URL || "https://tarangwave.netlify.app")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
      return;
    }

    callback(new Error("Origin not allowed by CORS"));
  },
  methods: ["GET", "HEAD", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
  optionsSuccessStatus: 204,
}));
app.use(express.json()); // lets us read JSON sent in requests
app.use("/uploads", express.static("uploads"));

// A simple health-check route: open http://localhost:5000/ in a browser
// and you should see this message if the backend is running correctly.
app.get("/", (req, res) => {
  res.send("Tarang API is running. See /api/songs, /api/auth, /api/playlists, /api/comments");
});

// Health-check endpoint for uptime monitors / deployment verification.
app.get("/api/health", (req, res) => {
  const databaseConnected = mongoose.connection.readyState === 1;
  res.status(databaseConnected ? 200 : 503).json({
    success: databaseConnected,
    message: databaseConnected ? "Backend API and database are ready" : "Database is not connected",
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/songs", songRoutes);
app.use("/api/playlists", playlistRoutes);
app.use("/api/comments", commentRoutes);

// Catch-all for anything that breaks, so the server never crashes silently
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong on the server.", error: err.message });
});

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  if (process.env.NODE_ENV === "production" && !process.env.JWT_SECRET) {
    throw new Error("Set JWT_SECRET before starting the API in production.");
  }

  await connectDB();
  app.listen(PORT, "0.0.0.0", () => console.log(`Tarang backend running on http://0.0.0.0:${PORT}`));
};

startServer().catch((error) => {
  console.error(`Tarang backend failed to start: ${error.message}`);
  process.exitCode = 1;
});
