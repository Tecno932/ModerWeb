import sharp from "sharp";
import crypto from "crypto";
import fs from "fs/promises";
import path from "path";

const BASE = "uploads/mods";

export async function processImage(file: Express.Multer.File) {
  const buffer = await fs.readFile(file.path);

  // 🔐 hash único (evita duplicados)
  const hash = crypto.createHash("md5").update(buffer).digest("hex");

  const webpPath = path.join(BASE, "webp", `${hash}.webp`);
  const thumbPath = path.join(BASE, "thumb", `${hash}.webp`);

  // 🚫 si ya existe → no reprocesar
  try {
    await fs.access(webpPath);
    return {
      url: `/uploads/mods/webp/${hash}.webp`,
      thumb: `/uploads/mods/thumb/${hash}.webp`,
    };
  } catch {}

  // 🖼️ convertir a webp (optimizado)
  await sharp(buffer)
    .resize({ width: 1200 }) // max ancho
    .webp({ quality: 80 })
    .toFile(webpPath);

  // 🧩 thumbnail
  await sharp(buffer)
    .resize(300, 300, { fit: "cover" })
    .webp({ quality: 70 })
    .toFile(thumbPath);

  return {
    url: `/uploads/mods/webp/${hash}.webp`,
    thumb: `/uploads/mods/thumb/${hash}.webp`,
  };
}