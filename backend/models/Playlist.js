// A Playlist = a collection of songs a user has grouped together.
import mongoose from "mongoose";

const playlistSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, default: "" },
    coverImage: { type: String, default: "" },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    songs: [{ type: mongoose.Schema.Types.ObjectId, ref: "Song" }],
    isPublic: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model("Playlist", playlistSchema);
