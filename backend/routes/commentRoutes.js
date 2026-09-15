import express from "express";
import {
  getSongComments,
  getPlaylistComments,
  addComment,
  deleteComment,
} from "../controllers/commentController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.get("/song/:songId", getSongComments);
router.get("/playlist/:playlistId", getPlaylistComments);
router.post("/", protect, addComment);
router.delete("/:id", protect, deleteComment);

export default router;
