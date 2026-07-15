import { Request } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import crypto from "crypto";

const uploadDir =
  path.join(process.cwd(), "uploads/mods");

fs.mkdirSync(uploadDir, {
  recursive: true,
});

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadDir);
  },

  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname);

    const filename =
      crypto.randomUUID() + ext;

    cb(null, filename);
  },
});

function fileFilter(
  _req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) {
  if (
    !file.mimetype.startsWith(
      "image/"
    )
  ) {
    return cb(
      new Error(
        "Solo imágenes permitidas"
      )
    );
  }

  cb(null, true);
}

export const modUpload = multer({
  storage,

  fileFilter,

  limits: {
    fileSize: 5 * 1024 * 1024,
    files: 11,
  },
});