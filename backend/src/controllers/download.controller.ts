import { Request, Response } from "express";
import { prisma } from "../lib/prisma";

export async function download(req: Request, res: Response) {
  try {
    const versionId = Number(req.params.versionId);

    if (!versionId) {
      return res.status(400).json({ error: "versionId inválido" });
    }

    const version = await prisma.modVersion.findUnique({
      where: { id: versionId },
      include: {
        files: true, // 🔥 IMPORTANTE: tiene que ser files, no downloads
        mod: true,
      },
    });

    if (!version || version.files.length === 0) {
      return res.status(404).json({ error: "No hay archivo" });
    }

    // 🔥 agarramos el archivo principal
    const file =
      version.files.find((f) => f.isPrimary) || version.files[0];

    // 🔥 incrementar downloads del archivo
    await prisma.modFile.update({
      where: { id: file.id },
      data: {
        downloads: {
          increment: 1,
        },
      },
    });

    // 🔥 opcional: incrementar downloads del mod
    await prisma.mod.update({
      where: { id: version.modId },
      data: {
        downloads: {
          increment: 1,
        },
      },
    });

    // 🔥 CDN READY
    const BASE_URL =
      process.env.CDN_URL || "http://192.168.0.110:3000";

    const finalUrl = `${BASE_URL}${file.url}`;

    console.log("⬇ REDIRECT A:", finalUrl);

    return res.redirect(finalUrl);
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Error";

    console.error("❌ DOWNLOAD ERROR:", message);

    return res.status(500).json({ error: message });
  }
}