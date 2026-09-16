// A User = someone with an account on Tarang.
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    username: { type: String, required: true, unique: true, trim: true, lowercase: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true }, // stored encrypted, never plain text
    profileImage: { type: String, default: "" },
    favoriteGenres: [{ type: String }], // used to personalize recommendations
    likedSongs: [{ type: mongoose.Schema.Types.ObjectId, ref: "Song" }],
    playlists: [{ type: mongoose.Schema.Types.ObjectId, ref: "Playlist" }],
    recentPlayedSongs: [{
      song: { type: mongoose.Schema.Types.ObjectId, ref: "Song" },
      playedAt: { type: Date, default: Date.now },
    }],
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
