// This is the starting point of the backend. Run it with: npm run dev
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import songRoutes from "./routes/songRoutes.js";
import playlistRoutes from "./routes/playlistRoutes.js";
import commentRoutes from "./routes/commentRoutes.js";

dotenv.config();
connectDB();

const app = express();

// Allow local development and the configured deployed frontend to call this API.
const allowedOrigins = (process.env.CLIENT_URL || "*")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(cors({
  origin: allowedOrigins.includes("*") ? "*" : allowedOrigins,
}));
app.use(express.json()); // lets us read JSON sent in requests
app.use("/uploads", express.static("uploads"));

// A simple health-check route: open http://localhost:5000/ in a browser
// and you should see this message if the backend is running correctly.
app.get("/", (req, res) => {
  res.send("Tarang API is running. See /api/songs, /api/auth, /api/playlists, /api/comments");
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
app.listen(PORT, () => console.log(`Tarang backend running on http://localhost:${PORT}`));
