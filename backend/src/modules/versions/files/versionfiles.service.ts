import { prisma } from "../../../lib/prisma";

import {
  BadRequestError,
  ForbiddenError,
  NotFoundError,
  UnauthorizedError,
} from "../../../utils/errors";

import { AuthRequest } from "../../../middleware/auth.middleware";

export async function registerFile(
  req: AuthRequest
) {
  const userId = req.userId;
  if (!userId) throw new UnauthorizedError("No autorizado");

  const versionId = Number(req.params.id);
  const { key, filename, size, type } = req.body;

  if (!key || !filename) {
    throw new BadRequestError("Missing data");
  }

  const version = await prisma.modVersion.findUnique({
    where: { id: versionId },
    include: { mod: true },
  });

  if (!version) throw new NotFoundError("Version not found");

  if (version.mod.authorId !== userId) {
    throw new ForbiddenError("Unauthorized");
  }

  // 🔥 solo un primary
  await prisma.modFile.updateMany({
    where: {
      modVersionId: versionId,
      isPrimary: true,
    },
    data: {
      isPrimary: false,
    },
  });

  const publicUrl = `${process.env.R2_PUBLIC_URL}/${key}`;

  const file = await prisma.modFile.create({
    data: {
      modVersionId: versionId,
      filename,
      displayName: filename,
      url: publicUrl, // 🔥 ya no /uploads
      size,
      type,
      isPrimary: true,
      releaseType: "release",
    },
  });

  return file;
}

export async function getFiles(
  modId: number
) {

  return prisma.modFile.findMany({
    where: {
      modVersion: {
        modId,
      },
    },
  });

}

export async function deleteFile(
  fileId: number,
  userId: number
) {

  const file =
    await prisma.modFile.findUnique({
      where: {
        id: fileId,
      },
      include: {
        modVersion: {
          include: {
            mod: true,
          },
        },
      },
    });

  if (!file) {
    throw new NotFoundError(
      "No existe"
    );
  }

  if (
    file.modVersion.mod.authorId !==
    userId
  ) {
    throw new ForbiddenError(
      "No autorizado"
    );
  }

  await prisma.modFile.delete({
    where: {
      id: fileId,
    },
  });

  return {
    success: true,
  };

}