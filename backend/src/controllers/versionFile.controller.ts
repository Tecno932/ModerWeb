import { prisma } from "../lib/prisma";
import {
  BadRequestError,
  ForbiddenError,
  NotFoundError,
  UnauthorizedError,
} from "../utils/errors";

export async function registerFile(req: any) {
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