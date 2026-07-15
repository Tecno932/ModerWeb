import { prisma } from "../../lib/prisma";
import { cacheInvalidate } from "../../lib/cache";

import {
  ForbiddenError,
  NotFoundError,
} from "../../utils/errors";

import {
  CreateFileInput,
  ReleaseType,
} from "./file.types";

export class FileService {
  static async uploadFile({
    versionId,
    userId,
    file,
  }: CreateFileInput) {
    const version =
      await prisma.modVersion.findUnique({
        where: {
          id: versionId,
        },
        include: {
          mod: true,
        },
      });

    if (!version) {
      throw new NotFoundError(
        "Versión no encontrada"
      );
    }

    if (
      version.mod.authorId !== userId
    ) {
      throw new ForbiddenError(
        "No autorizado"
      );
    }

    await prisma.modFile.updateMany({
      where: {
        modVersionId: versionId,
        isPrimary: true,
      },
      data: {
        isPrimary: false,
      },
    });

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

          releaseType:
            ReleaseType.release,

          isPrimary: true,
        },
      });

    await cacheInvalidate("mods:*");

    return newFile;
  }
}