import express from "express";
import {
  getSongs,
  getRecommended,
  searchSongs,
  getSongById,
  registerPlay,
  toggleLike,
  createSong,
  deleteUploadedSong,
  deleteSelectedUploadedSongs,
} from "../controllers/songController.js";
import { protect } from "../middleware/auth.js";
import { optionalAuth } from "../middleware/optionalAuth.js";

const router = express.Router();

router.get("/", getSongs);                        // browse / filter by genre
router.get("/recommended", optionalAuth, getRecommended); // personalized picks
router.get("/search", searchSongs);                // search by name/artist/album/movie
router.get("/:id", getSongById);                   // one song's details
router.put("/:id/play", registerPlay);             // count a play
router.put("/:id/like", protect, toggleLike);      // like / unlike
router.post("/", createSong);                      // add a song (library management)
router.delete("/uploaded/selected", protect, deleteSelectedUploadedSongs);
router.delete("/:id", protect, deleteUploadedSong); // delete my uploaded song

export default router;
