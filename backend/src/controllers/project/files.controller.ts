import { prisma } from "../../lib/prisma";

export async function getFiles(req: any, res: any) {
  const modId = Number(req.params.id);

  const files = await prisma.modFile.findMany({
    where: {
      modVersion: {
        modId,
      },
    },
  });

  res.json(files);
}

export async function deleteFile(req: any, res: any) {
  const fileId = Number(req.params.fileId);

  const file = await prisma.modFile.findUnique({
    where: { id: fileId },
    include: {
      modVersion: {
        include: { mod: true },
      },
    },
  });

  if (!file) {
    return res.status(404).json({ error: "No existe" });
  }

  if (file.modVersion.mod.authorId !== req.userId) {
    return res.status(403).json({ error: "No autorizado" });
  }

  await prisma.modFile.delete({
    where: { id: fileId },
  });

  res.json({ success: true });
}