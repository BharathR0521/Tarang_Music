import fs from "node:fs/promises";
import path from "node:path";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../models/User.js";

// Helper: creates a login token for a given user id
const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });

// POST /api/auth/register  -> create a new account
export const registerUser = async (req, res) => {
  try {
    const { name, email, password, favoriteGenres } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email and password are all required." });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "An account with this email already exists." });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      favoriteGenres: favoriteGenres || [],
    });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      profileImage: user.profileImage,
      favoriteGenres: user.favoriteGenres,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: "Could not create account.", error: error.message });
  }
};

// POST /api/auth/login -> check email + password, hand back a token
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Incorrect email or password." });
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      profileImage: user.profileImage,
      favoriteGenres: user.favoriteGenres,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: "Login failed.", error: error.message });
  }
};

// POST /api/auth/profile-image -> replace the logged-in user's profile image
export const uploadProfileImage = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "Choose an image to upload." });

    if (req.user.profileImage) {
      const previousFile = path.basename(new URL(req.user.profileImage, "http://localhost").pathname);
      await fs.unlink(path.resolve("uploads", previousFile)).catch(() => {});
    }

    req.user.profileImage = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
    await req.user.save();
    res.json({
      _id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      profileImage: req.user.profileImage,
      favoriteGenres: req.user.favoriteGenres,
    });
  } catch (error) {
    res.status(500).json({ message: "Could not update profile image.", error: error.message });
  }
};

// GET /api/auth/me -> return the logged-in user's own profile
export const getMe = async (req, res) => {
  res.json(req.user);
};
