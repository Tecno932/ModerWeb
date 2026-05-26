import { prisma } from "../lib/prisma";
import { getRedis } from "../lib/redis";

import { Scopes } from "../constants/scopes";
import { TeamService } from "./team.service";

import { sanitizeRichText } from "../utils/sanitize";

import {
  ForbiddenError,
  NotFoundError,
} from "../utils/errors";

async function invalidate(pattern: string) {
  const redis = getRedis();

  // ✅ si Redis no existe, no hacemos nada
  if (!redis) return;

  const stream = redis.scanStream({
    match: pattern,
  });

  return new Promise<void>((resolve) => {
    stream.on("data", async (keys: string[]) => {
      try {
        if (keys.length) {
          await redis.del(...keys);
        }
      } catch (err) {
        console.log("Redis invalidate error");
      }
    });

    stream.on("end", () => {
      resolve();
    });

    stream.on("error", () => {
      resolve();
    });
  });
}

export class VersionService {
  static async createVersion(
    data: any,
    userId: number,
    modId: number
  ) {
    const mod = await prisma.mod.findUnique({
      where: {
        id: modId,
      },
    });

    if (!mod || mod.deletedAt) {
      throw new NotFoundError(
        "Mod no encontrado"
      );
    }

    const allowed = await TeamService.hasScope(
      userId,
      mod,
      Scopes.VERSION_CREATE
    );

    if (!allowed) {
      throw new ForbiddenError(
        "No autorizado"
      );
    }

    // ✅ sanitización segura
    const safeChangelog = sanitizeRichText(
      data.changelog || ""
    );

    const version =
      await prisma.modVersion.create({
        data: {
          modId,

          version: data.version,

          minecraftVersion:
            data.minecraftVersion,

          loader: data.loader,

          changelog: safeChangelog,
        },
      });

    // ✅ invalidamos cache si Redis existe
    await invalidate("mods:*");

    return version;
  }

  static async getVersions(modId: number) {
    return prisma.modVersion.findMany({
      where: {
        modId,
      },

      include: {
        files: true,
      },
    });
  }
}