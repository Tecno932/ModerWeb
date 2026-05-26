import { prisma } from "../../lib/prisma";

export async function getGallery(req: any, res: any) {
  const modId = Number(req.params.id);

  const images = await prisma.modImage.findMany({
    where: { modId },
  });

  res.json(images);
}

export async function deleteImage(req: any, res: any) {
  const imageId = Number(req.params.imageId);

  await prisma.modImage.delete({
    where: { id: imageId },
  });

  res.json({ success: true });
}