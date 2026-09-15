import express from "express";
import { registerUser, loginUser, getMe, uploadProfileImage } from "../controllers/authController.js";
import { protect } from "../middleware/auth.js";
import { uploadSong } from "../middleware/uploadSong.js";

const router = express.Router();

router.post("/register", registerUser); // create account
router.post("/login", loginUser);       // sign in
router.get("/me", protect, getMe);      // get my own profile
router.post("/profile-image", protect, uploadSong.single("profileImage"), uploadProfileImage);

export default router;
