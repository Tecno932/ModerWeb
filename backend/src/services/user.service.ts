import { prisma } from "../lib/prisma";

export async function getUserProfile(username: string, currentUserId?: number) {
  const user = await prisma.user.findUnique({
    where: { username },
    include: {
      mods: {
        include: {
          images: true,
          _count: {
            select: { likes: true },
          },
        },
      },
      favorites: {
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
      },
    },
  });

  if (!user) throw new Error("Usuario no encontrado");

  // 📊 stats
  const totalLikes = user.mods.reduce(
    (acc, mod) => acc + mod._count.likes,
    0
  );

  const totalViews = user.mods.reduce(
    (acc, mod) => acc + mod.views,
    0
  );

  return {
    id: user.id,
    username: user.username,
    role: user.role,

    stats: {
      mods: user.mods.length,
      favorites: user.favorites.length,
      totalLikes,
      totalViews,
    },

    mods: user.mods,

    favorites: user.favorites.map((f) => f.mod),
  };
}