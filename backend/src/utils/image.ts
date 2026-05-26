import sharp from "sharp";
import fs from "fs";

export async function cropToSquare(filePath: string) {
  const image = sharp(filePath);
  const metadata = await image.metadata();

  if (!metadata.width || !metadata.height) return filePath;

  const size = Math.min(metadata.width, metadata.height);

  const left = Math.floor((metadata.width - size) / 2);
  const top = Math.floor((metadata.height - size) / 2);

  const newPath = filePath.replace(/(\.\w+)$/, "-processed$1");

  await image
    .extract({ width: size, height: size, left, top })
    .resize(500, 500)
    .toFile(newPath);

  // ❌ borrar original
  await fs.promises.unlink(filePath);

  return newPath;
}