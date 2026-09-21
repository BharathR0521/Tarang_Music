import fs from "node:fs/promises";
import path from "node:path";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../models/User.js";
import { getFilenameFromMediaUrl, getUploadedMediaUrl, normalizeMediaUrl } from "../utils/mediaUrl.js";

// Helper: creates a login token for a given user id
const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });

// POST /api/auth/register  -> create a new account
export const registerUser = async (req, res) => {
  try {
    const { name, username, email, password, favoriteGenres } = req.body;
    const normalizedName = name?.toString().trim();
    const normalizedUsername = username?.toString().trim().toLowerCase();
    const normalizedEmail = email?.toString().trim().toLowerCase();

    if (!normalizedName || !normalizedUsername || !normalizedEmail || !password) {
      return res.status(400).json({ message: "Name, username, email and password are all required." });
    }
    if (password.toString().length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters." });
    }

    const existingUser = await User.findOne({
      $or: [{ username: normalizedUsername }, { email: normalizedEmail }],
    });

    if (existingUser) {
      if (existingUser.username === normalizedUsername) {
        return res.status(400).json({ message: "This username is already taken." });
      }
      return res.status(400).json({ message: "An account with this email already exists." });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name: normalizedName,
      username: normalizedUsername,
      email: normalizedEmail,
      password: hashedPassword,
      favoriteGenres: favoriteGenres || [],
    });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      username: user.username,
      email: user.email,
      profileImage: normalizeMediaUrl(req, user.profileImage),
      favoriteGenres: user.favoriteGenres,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: "Could not create account.", error: error.message });
  }
};

// POST /api/auth/login -> check username/email + password, hand back a token
export const loginUser = async (req, res) => {
  try {
    const rawIdentifier = (req.body.username || req.body.email || "").toString().trim();
    const password = req.body.password?.toString();

    if (!rawIdentifier || !password) {
      return res.status(400).json({ message: "Username or email and password are required." });
    }

    const normalizedIdentifier = rawIdentifier.toLowerCase();
    const identifierQuery = normalizedIdentifier.includes("@")
      ? { email: normalizedIdentifier }
      : { username: normalizedIdentifier };
    const user = await User.findOne(identifierQuery);

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Incorrect username/email or password." });
    }

    res.json({
      _id: user._id,
      name: user.name,
      username: user.username,
      email: user.email,
      profileImage: normalizeMediaUrl(req, user.profileImage),
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
      const previousFile = getFilenameFromMediaUrl(req.user.profileImage);
      if (previousFile) {
        await fs.unlink(path.resolve("uploads", previousFile)).catch(() => {});
      }
    }

    req.user.profileImage = getUploadedMediaUrl(req, req.file.filename);
    await req.user.save();
    res.json({
      _id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      profileImage: normalizeMediaUrl(req, req.user.profileImage),
      favoriteGenres: req.user.favoriteGenres,
    });
  } catch (error) {
    res.status(500).json({ message: "Could not update profile image.", error: error.message });
  }
};

// GET /api/auth/me -> return the logged-in user's own profile
export const getMe = async (req, res) => {
  const user = req.user.toObject();
  user.profileImage = normalizeMediaUrl(req, user.profileImage);
  res.json(user);
};
