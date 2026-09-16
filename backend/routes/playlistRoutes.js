import express from "express";
import {
  getMyPlaylists,
  getPlaylistById,
  createPlaylist,
  updatePlaylist,
  addSongToPlaylist,
  uploadSongToPlaylist,
  removeSongFromPlaylist,
  deletePlaylist,
} from "../controllers/playlistController.js";
import { protect } from "../middleware/auth.js";
import { uploadSong } from "../middleware/uploadSong.js";

const router = express.Router();

router.get("/mine", protect, getMyPlaylists);
router.get("/:id", protect, getPlaylistById);
router.post("/", protect, uploadSong.single("coverImage"), createPlaylist);
router.put("/:id", protect, uploadSong.single("coverImage"), updatePlaylist);
router.put("/:id/songs/:songId", protect, addSongToPlaylist);
router.post(
  "/:id/songs/upload",
  protect,
  uploadSong.fields([
    { name: "audio", maxCount: 1 },
    { name: "coverImage", maxCount: 1 },
  ]),
  uploadSongToPlaylist
);
router.delete("/:id/songs/:songId", protect, removeSongFromPlaylist);
router.delete("/:id", protect, deletePlaylist);

export default router;
