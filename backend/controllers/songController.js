import fs from "node:fs/promises";
import path from "node:path";
import Song from "../models/Song.js";
import Playlist from "../models/Playlist.js";
import User from "../models/User.js";

const removeSongMedia = async (song) => {
  for (const mediaUrl of [song.audioUrl, song.coverImage]) {
    if (!mediaUrl) continue;
    const filename = path.basename(new URL(mediaUrl, "http://localhost").pathname);
    await fs.unlink(path.resolve("uploads", filename)).catch(() => {});
  }
};

const deleteUploadedSongs = async (songs) => {
  const songIds = songs.map((song) => song._id);
  await Playlist.updateMany({ songs: { $in: songIds } }, { $pull: { songs: { $in: songIds } } });
  await User.updateMany({ likedSongs: { $in: songIds } }, { $pull: { likedSongs: { $in: songIds } } });
  await Promise.all(songs.map(removeSongMedia));
  await Song.deleteMany({ _id: { $in: songIds } });
};

// GET /api/songs -> browse everything, or filter by genre with ?genre=
export const getSongs = async (req, res) => {
  try {
    const filter = {};
    if (req.query.genre) filter.genre = req.query.genre;
    const songs = await Song.find(filter).sort({ createdAt: -1 });
    res.json(songs);
  } catch (error) {
    res.status(500).json({ message: "Could not load songs.", error: error.message });
  }
};

// GET /api/songs/recommended -> personalized picks for the logged-in user
// (falls back to the most-played songs for guests / new users)
export const getRecommended = async (req, res) => {
  try {
    let songs;
    if (req.user && req.user.favoriteGenres?.length) {
      songs = await Song.find({ genre: { $in: req.user.favoriteGenres } }).limit(20);
    }
    if (!songs || songs.length === 0) {
      songs = await Song.find().sort({ plays: -1 }).limit(20);
    }
    res.json(songs);
  } catch (error) {
    res.status(500).json({ message: "Could not load recommendations.", error: error.message });
  }
};

// GET /api/songs/search?q=... -> search by title, artist, album or movie name
export const searchSongs = async (req, res) => {
  try {
    const q = req.query.q?.trim();
    if (!q) return res.json([]);

    const songs = await Song.find({
      $or: [
        { title: { $regex: q, $options: "i" } },
        { artist: { $regex: q, $options: "i" } },
        { album: { $regex: q, $options: "i" } },
        { movie: { $regex: q, $options: "i" } },
      ],
    }).limit(50);

    res.json(songs);
  } catch (error) {
    res.status(500).json({ message: "Search failed.", error: error.message });
  }
};

// GET /api/songs/:id -> a single song's details
export const getSongById = async (req, res) => {
  try {
    const song = await Song.findById(req.params.id);
    if (!song) return res.status(404).json({ message: "Song not found." });
    res.json(song);
  } catch (error) {
    res.status(500).json({ message: "Could not load song.", error: error.message });
  }
};

// PUT /api/songs/:id/play -> call this when playback starts, to count a play
export const registerPlay = async (req, res) => {
  try {
    const song = await Song.findByIdAndUpdate(
      req.params.id,
      { $inc: { plays: 1 } },
      { new: true }
    );
    if (!song) return res.status(404).json({ message: "Song not found." });
    res.json({ plays: song.plays });
  } catch (error) {
    res.status(500).json({ message: "Could not register play.", error: error.message });
  }
};

// PUT /api/songs/:id/like -> toggle like/unlike on a song for the logged-in user
export const toggleLike = async (req, res) => {
  try {
    const song = await Song.findById(req.params.id);
    if (!song) return res.status(404).json({ message: "Song not found." });

    const alreadyLiked = song.likes.some((id) => id.toString() === req.user._id.toString());

    if (alreadyLiked) {
      song.likes = song.likes.filter((id) => id.toString() !== req.user._id.toString());
      await User.findByIdAndUpdate(req.user._id, { $pull: { likedSongs: song._id } });
    } else {
      song.likes.push(req.user._id);
      await User.findByIdAndUpdate(req.user._id, { $addToSet: { likedSongs: song._id } });
    }

    await song.save();
    res.json({ liked: !alreadyLiked, likeCount: song.likes.length });
  } catch (error) {
    res.status(500).json({ message: "Could not update like.", error: error.message });
  }
};

// POST /api/songs -> add a new song to the library (used by an admin/seed script)
export const createSong = async (req, res) => {
  try {
    const song = await Song.create(req.body);
    res.status(201).json(song);
  } catch (error) {
    res.status(500).json({ message: "Could not add song.", error: error.message });
  }
};

// DELETE /api/songs/:id -> delete a song uploaded by the logged-in user
export const deleteUploadedSong = async (req, res) => {
  try {
    const song = await Song.findOne({ _id: req.params.id, uploadedBy: req.user._id });
    if (!song) return res.status(404).json({ message: "Uploaded song not found." });

    await Playlist.updateMany({ songs: song._id }, { $pull: { songs: song._id } });
    await User.updateMany({ likedSongs: song._id }, { $pull: { likedSongs: song._id } });
    await removeSongMedia(song);
    await song.deleteOne();
    res.json({ message: "Song deleted." });
  } catch (error) {
    res.status(500).json({ message: "Could not delete song.", error: error.message });
  }
};

// DELETE /api/songs/uploaded/selected -> permanently delete selected user uploads
export const deleteSelectedUploadedSongs = async (req, res) => {
  try {
    const songIds = Array.isArray(req.body.songIds) ? req.body.songIds : [];
    if (songIds.length === 0) return res.status(400).json({ message: "Select at least one uploaded song." });

    const songs = await Song.find({ _id: { $in: songIds }, uploadedBy: req.user._id });
    if (songs.length === 0) return res.status(404).json({ message: "No selected uploaded songs found." });

    await deleteUploadedSongs(songs);
    res.json({ message: "Selected uploaded songs deleted.", deletedCount: songs.length });
  } catch (error) {
    res.status(500).json({ message: "Could not delete selected songs.", error: error.message });
  }
};

