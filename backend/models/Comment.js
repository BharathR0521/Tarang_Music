// A Comment = something a user wrote on a song or a playlist.
import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    text: { type: String, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    // A comment belongs to EITHER a song OR a playlist (whichever is set)
    song: { type: mongoose.Schema.Types.ObjectId, ref: "Song" },
    playlist: { type: mongoose.Schema.Types.ObjectId, ref: "Playlist" },
  },
  { timestamps: true }
);

export default mongoose.model("Comment", commentSchema);
