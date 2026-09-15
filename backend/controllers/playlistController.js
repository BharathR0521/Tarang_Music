import fs from "node:fs/promises";
import path from "node:path";
import Playlist from "../models/Playlist.js";
import Song from "../models/Song.js";
import User from "../models/User.js";

// GET /api/playlists/mine -> all playlists belonging to the logged-in user
export const getMyPlaylists = async (req, res) => {
  try {
    const playlists = await Playlist.find({ owner: req.user._id }).populate("songs");
    res.json(playlists);
  } catch (error) {
    res.status(500).json({ message: "Could not load playlists.", error: error.message });
  }
};

// GET /api/playlists/:id -> one playlist, with its full song list
export const getPlaylistById = async (req, res) => {
  try {
    const playlist = await Playlist.findById(req.params.id).populate("songs").populate("owner", "name");
    if (!playlist) return res.status(404).json({ message: "Playlist not found." });
    res.json(playlist);
  } catch (error) {
    res.status(500).json({ message: "Could not load playlist.", error: error.message });
  }
};

// POST /api/playlists -> create a new, empty (or pre-filled) playlist
export const createPlaylist = async (req, res) => {
  try {
    const { name, description, coverImage, isPublic } = req.body;
    if (!name) return res.status(400).json({ message: "Playlist needs a name." });

    const playlist = await Playlist.create({
      name,
      description,
      coverImage: req.file ? `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}` : coverImage,
      isPublic,
      owner: req.user._id,
      songs: [],
    });

    await User.findByIdAndUpdate(req.user._id, { $push: { playlists: playlist._id } });
    res.status(201).json(playlist);
  } catch (error) {
    res.status(500).json({ message: "Could not create playlist.", error: error.message });
  }
};

// PUT /api/playlists/:id -> rename / edit playlist details
export const updatePlaylist = async (req, res) => {
  try {
    const playlist = await Playlist.findOne({ _id: req.params.id, owner: req.user._id });
    if (!playlist) return res.status(404).json({ message: "Playlist not found." });

    const { name, description, coverImage, isPublic } = req.body;
    if (name !== undefined) playlist.name = name;
    if (description !== undefined) playlist.description = description;
    if (req.file) {
      if (playlist.coverImage) {
        const previousFile = path.basename(new URL(playlist.coverImage, "http://localhost").pathname);
        await fs.unlink(path.resolve("uploads", previousFile)).catch(() => {});
      }
      playlist.coverImage = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
    } else if (coverImage !== undefined) {
      playlist.coverImage = coverImage;
    }
    if (isPublic !== undefined) playlist.isPublic = isPublic;

    await playlist.save();
    res.json(playlist);
  } catch (error) {
    res.status(500).json({ message: "Could not update playlist.", error: error.message });
  }
};

// PUT /api/playlists/:id/songs/:songId -> add one song to a playlist
export const addSongToPlaylist = async (req, res) => {
  try {
    const playlist = await Playlist.findOne({ _id: req.params.id, owner: req.user._id });
    if (!playlist) return res.status(404).json({ message: "Playlist not found." });

    await playlist.updateOne({ $addToSet: { songs: req.params.songId } });
    const updated = await Playlist.findById(req.params.id).populate("songs");
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: "Could not add song to playlist.", error: error.message });
  }
};

// POST /api/playlists/:id/songs/upload -> upload a song and add it to a playlist
export const uploadSongToPlaylist = async (req, res) => {
  try {
    const playlist = await Playlist.findOne({ _id: req.params.id, owner: req.user._id });
    if (!playlist) return res.status(404).json({ message: "Playlist not found." });
    const audioFile = req.files?.audio?.[0];
    const coverFile = req.files?.coverImage?.[0];
    if (!audioFile) return res.status(400).json({ message: "Choose an audio file to upload." });
    if (!coverFile) return res.status(400).json({ message: "Cover image is required for uploaded songs." });

    const { title, artist, genre } = req.body;
    if (!title || !artist) return res.status(400).json({ message: "Title and artist are required." });

    const song = await Song.create({
      title,
      artist,
      genre: genre || "Uploaded",
      coverImage: `${req.protocol}://${req.get("host")}/uploads/${coverFile.filename}`,
      audioUrl: `${req.protocol}://${req.get("host")}/uploads/${audioFile.filename}`,
      uploadedBy: req.user._id,
    });

    playlist.songs.push(song._id);
    await playlist.save();
    res.status(201).json(await Playlist.findById(playlist._id).populate("songs"));
  } catch (error) {
    res.status(500).json({ message: "Could not upload song.", error: error.message });
  }
};

// DELETE /api/playlists/:id/songs/:songId -> remove one song from a playlist
export const removeSongFromPlaylist = async (req, res) => {
  try {
    const playlist = await Playlist.findOne({ _id: req.params.id, owner: req.user._id });
    if (!playlist) return res.status(404).json({ message: "Playlist not found." });

    await playlist.updateOne({ $pull: { songs: req.params.songId } });
    const updated = await Playlist.findById(req.params.id).populate("songs");
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: "Could not remove song from playlist.", error: error.message });
  }
};

// DELETE /api/playlists/:id -> delete a whole playlist
export const deletePlaylist = async (req, res) => {
  try {
    const playlist = await Playlist.findOneAndDelete({ _id: req.params.id, owner: req.user._id });
    if (!playlist) return res.status(404).json({ message: "Playlist not found." });

    await User.findByIdAndUpdate(req.user._id, { $pull: { playlists: playlist._id } });
    res.json({ message: "Playlist deleted." });
  } catch (error) {
    res.status(500).json({ message: "Could not delete playlist.", error: error.message });
  }
};
