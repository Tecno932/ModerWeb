import { prisma } from "../lib/prisma";

export async function likeMod(userId: number, modId: number) {
  // verificar si ya existe
  const existing = await prisma.modLike.findUnique({
    where: {
      userId_modId: { userId, modId },
    },
  });

  if (existing) {
    // 👈 importante: avisar que ya estaba
    return { liked: true, alreadyLiked: true };
  }

  await prisma.$transaction([
    prisma.modLike.create({
      data: { userId, modId },
    }),
    prisma.mod.update({
      where: { id: modId },
      data: {
        likesCount: { increment: 1 },
      },
    }),
  ]);

  return { liked: true };
}

export async function unlikeMod(userId: number, modId: number) {
  const existing = await prisma.modLike.findUnique({
    where: {
      userId_modId: { userId, modId },
    },
  });

  if (!existing) {
    return { liked: false };
  }

  await prisma.$transaction([
    prisma.modLike.delete({
      where: {
        userId_modId: { userId, modId },
      },
    }),
    prisma.mod.update({
      where: { id: modId },
      data: {
        likesCount: { decrement: 1 },
      },
    }),
  ]);

  return { liked: false };
}

export async function getLikesCount(modId: number) {
  const count = await prisma.modLike.count({
    where: { modId },
  });

  return { count };
}

export async function getLikeStatus(userId: number, modId: number) {
  const like = await prisma.modLike.findUnique({
    where: {
      userId_modId: { userId, modId },
    },
  });

  return { liked: !!like };
}