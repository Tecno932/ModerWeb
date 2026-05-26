import multer from "multer";
import path from "path";
import crypto from "crypto";
import { BadRequestError } from "../utils/errors";

const allowedTypes = [
  "image/png",
  "image/jpeg",
  "image/webp",
  "application/java-archive",
  "application/zip",
  "application/x-zip-compressed",
  "application/octet-stream", // fallback
];

const storage = multer.diskStorage({
  destination: "uploads/mods",
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const name = crypto.randomBytes(16).toString("hex");
    cb(null, name + ext);
  },
});

const fileFilter: multer.Options["fileFilter"] = (req, file, cb) => {
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new BadRequestError("Tipo de archivo no permitido"));
  }
};

export const upload = multer({
  storage, // 👈 CAMBIO CLAVE
  limits: {
    fileSize: 1024 * 1024 * 50,
  },
  fileFilter,
});