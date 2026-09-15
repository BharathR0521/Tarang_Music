import fs from "node:fs";
import path from "node:path";
import multer from "multer";

const uploadDirectory = path.resolve("uploads");
fs.mkdirSync(uploadDirectory, { recursive: true });

const storage = multer.diskStorage({
  destination: uploadDirectory,
  filename: (req, file, callback) => {
    const extension = path.extname(file.originalname).toLowerCase();
    callback(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${extension}`);
  },
});

const fileFilter = (req, file, callback) => {
  if (file.fieldname === "audio" && file.mimetype.startsWith("audio/")) return callback(null, true);
  if (["coverImage", "profileImage"].includes(file.fieldname) && file.mimetype.startsWith("image/")) return callback(null, true);
  callback(new Error("Upload an audio file and an optional image file."));
};

export const uploadSong = multer({
  storage,
  fileFilter,
  limits: { fileSize: 50 * 1024 * 1024 },
});
