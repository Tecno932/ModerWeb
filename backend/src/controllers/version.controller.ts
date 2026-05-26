import { prisma } from "../lib/prisma";
import { VersionService } from "../services/version.service";
import { createVersionSchema } from "../validations/version.schema";

export async function createVersion(req: any, res: any) {
  try {
    const parsed = createVersionSchema.parse(req.body);

    const version = await VersionService.createVersion(
      parsed,
      req.userId,
      Number(req.params.id)
    );

    res.json(version);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
}

export async function getVersions(req: any, res: any) {
  const versions = await VersionService.getVersions(
    Number(req.params.id)
  );
  res.json(versions);
}

export async function deleteVersion(req: any, res: any) {
  const id = Number(req.params.id);

  const version = await prisma.modVersion.findUnique({
    where: { id },
    include: { mod: true },
  });

  if (!version) {
    return res.status(404).json({ error: "No existe" });
  }

  if (version.mod.authorId !== req.userId) {
    return res.status(403).json({ error: "No autorizado" });
  }

  await prisma.modVersion.delete({
    where: { id },
  });

  res.json({ success: true });
}

export async function updateVersion(req: any, res: any) {
  const id = Number(req.params.id);

  const version = await prisma.modVersion.findUnique({
    where: { id },
    include: { mod: true },
  });

  if (!version) {
    return res.status(404).json({ error: "No existe" });
  }

  if (version.mod.authorId !== req.userId) {
    return res.status(403).json({ error: "No autorizado" });
  }

  const updated = await prisma.modVersion.update({
    where: { id },
    data: {
      version: req.body.version,
    },
  });

  res.json(updated);
}