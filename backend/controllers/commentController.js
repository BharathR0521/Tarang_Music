import Comment from "../models/Comment.js";

// GET /api/comments/song/:songId -> all comments on one song
export const getSongComments = async (req, res) => {
  try {
    const comments = await Comment.find({ song: req.params.songId })
      .populate("user", "name")
      .sort({ createdAt: -1 });
    res.json(comments);
  } catch (error) {
    res.status(500).json({ message: "Could not load comments.", error: error.message });
  }
};

// GET /api/comments/playlist/:playlistId -> all comments on one playlist
export const getPlaylistComments = async (req, res) => {
  try {
    const comments = await Comment.find({ playlist: req.params.playlistId })
      .populate("user", "name")
      .sort({ createdAt: -1 });
    res.json(comments);
  } catch (error) {
    res.status(500).json({ message: "Could not load comments.", error: error.message });
  }
};

// POST /api/comments -> add a comment to a song OR a playlist
export const addComment = async (req, res) => {
  try {
    const { text, songId, playlistId } = req.body;
    if (!text || (!songId && !playlistId)) {
      return res.status(400).json({ message: "Comment text and a song or playlist are required." });
    }

    const comment = await Comment.create({
      text,
      user: req.user._id,
      song: songId || undefined,
      playlist: playlistId || undefined,
    });

    const populated = await comment.populate("user", "name");
    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: "Could not post comment.", error: error.message });
  }
};

// DELETE /api/comments/:id -> remove your own comment
export const deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!comment) return res.status(404).json({ message: "Comment not found." });
    res.json({ message: "Comment deleted." });
  } catch (error) {
    res.status(500).json({ message: "Could not delete comment.", error: error.message });
  }
};
