import express from "express";
import {
  getSongs,
  getMyUploadedSongs,
  getRecommended,
  searchSongs,
  getSongById,
  registerPlay,
  toggleLike,
  createSong,
  uploadSong,
  deleteUploadedSong,
  deleteSelectedUploadedSongs,
  getRecentlyPlayed,
} from "../controllers/songController.js";
import { protect } from "../middleware/auth.js";
import { optionalAuth } from "../middleware/optionalAuth.js";
import { uploadSong as uploadSongMiddleware } from "../middleware/uploadSong.js";

const router = express.Router();

router.get("/", getSongs);                        // browse / filter by genre
router.get("/mine", protect, getMyUploadedSongs); // songs uploaded by the current account
router.get("/recent", protect, getRecentlyPlayed); // recently played by the current account
router.get("/recommended", optionalAuth, getRecommended); // personalized picks
router.get("/search", searchSongs);                // search by name/artist/album/movie
router.get("/:id", getSongById);                   // one song's details
router.put("/:id/play", optionalAuth, registerPlay); // count a play and track it for signed-in users
router.put("/:id/like", protect, toggleLike);      // like / unlike
router.post("/", createSong);                      // add a song (library management)
router.post(
  "/upload",
  protect,
  uploadSongMiddleware.fields([
    { name: "audio", maxCount: 1 },
    { name: "coverImage", maxCount: 1 },
  ]),
  uploadSong,
);
router.delete("/uploaded/selected", protect, deleteSelectedUploadedSongs);
router.delete("/:id", protect, deleteUploadedSong); // delete my uploaded song

export default router;
