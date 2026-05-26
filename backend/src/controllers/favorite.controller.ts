import { prisma } from "../lib/prisma";
import { NotFoundError } from "../utils/errors";

export class FavoriteController {
  static async toggleFavorite(userId: number, modId: number) {
    // Verificar que el mod existe antes de favoritear
    const mod = await prisma.mod.findUnique({ where: { id: modId } });
    if (!mod) throw new NotFoundError("Mod no encontrado");

    const existing = await prisma.favorite.findUnique({
      where: { userId_modId: { userId, modId } },
    });

    if (existing) {
      await prisma.favorite.delete({
        where: { userId_modId: { userId, modId } },
      });
      return { favorited: false };
    }

    await prisma.favorite.create({
      data: { userId, modId },
    });

    return { favorited: true };
  }

  static async isFavorited(userId: number, modId: number) {
    const fav = await prisma.favorite.findUnique({
      where: { userId_modId: { userId, modId } },
    });
    return !!fav;
  }

  // Para el perfil de usuario (ya lo usás en user.service.ts)
  static async getUserFavorites(userId: number) {
    return prisma.favorite.findMany({
      where: { userId },
      include: {
        mod: {
          include: {
            images: true,
            _count: { select: { likes: true } },
          },
        },
      },
    });
  }
}