// A Song = one track in the music library.
import mongoose from "mongoose";

const songSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    artist: { type: String, required: true },
    album: { type: String, default: "Single" },
    movie: { type: String, default: "" }, // useful for film-music search (Tamil cinema etc.)
    genre: { type: String, required: true },
    coverImage: { type: String, default: "" }, // URL to the album art
    audioUrl: { type: String, required: true }, // URL that the player streams from
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    duration: { type: Number, default: 0 }, // in seconds
    plays: { type: Number, default: 0 },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

// Lets us quickly search by title / artist / album / movie
songSchema.index({ title: "text", artist: "text", album: "text", movie: "text" });

export default mongoose.model("Song", songSchema);
