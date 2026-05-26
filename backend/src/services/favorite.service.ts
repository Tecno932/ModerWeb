import { prisma } from "../lib/prisma";

export async function addFavorite(userId: number, modId: number) {
  const existing = await prisma.favorite.findUnique({
    where: {
      userId_modId: { userId, modId },
    },
  });

  if (existing) {
    return { favorited: true, alreadyFavorited: true };
  }

  await prisma.favorite.create({
    data: { userId, modId },
  });

  return { favorited: true };
}

export async function removeFavorite(userId: number, modId: number) {
  const existing = await prisma.favorite.findUnique({
    where: {
      userId_modId: { userId, modId },
    },
  });

  if (!existing) {
    return { favorited: false };
  }

  await prisma.favorite.delete({
    where: {
      userId_modId: { userId, modId },
    },
  });

  return { favorited: false };
}

export async function getFavoriteStatus(userId: number, modId: number) {
  const fav = await prisma.favorite.findUnique({
    where: {
      userId_modId: { userId, modId },
    },
  });

  return { favorited: !!fav };
}

export async function getFavoritesByUser(userId: number) {
  return prisma.favorite.findMany({
    where: { userId },
    include: {
      mod: {
        include: {
          images: true,
          _count: {
            select: { likes: true },
          },
        },
      },
    },
  });
}