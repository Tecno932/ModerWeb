import { prisma } from "../lib/prisma";
import { getRedis } from "../lib/redis";

async function invalidate(pattern: string) {

  const redis = getRedis();

  if (!redis) {
    return;
  }

  try {
    const stream = redis.scanStream({
      match: pattern,
    });

    stream.on(
      "data",
      async (keys: string[]) => {
        try {
          if (keys.length) {
            await redis.del(...keys);
          }
        } catch {}
      }
    );

  } catch {}
}

export class FileService {
  static async uploadFile(
    file: any,
    versionId: number,
    userId: number
  ) {

    const version =
      await prisma.modVersion.findUnique({
        where: {
          id: versionId,
        },

        include: {
          mod: true,
        },
      });

    if (
      !version ||
      version.mod.authorId !== userId
    ) {
      throw new Error("No autorizado");
    }

    const newFile =
      await prisma.modFile.create({
        data: {
          modVersionId: versionId,

          filename: file.filename,

          displayName:
            file.originalname,

          url:
            `/uploads/files/${file.filename}`,

          size: file.size,

          type: file.mimetype,

          releaseType: "release",

          isPrimary: true,
        },
      });

    await invalidate("mods:*");

    return newFile;
  }
}