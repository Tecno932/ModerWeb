import { prisma } from "../../lib/prisma";
import { NotFoundError } from "../../utils/errors";

export class InteractionsService {
  //////////////////////////////////////////////////////
  // GET INTERACTIONS
  //////////////////////////////////////////////////////

  static async getInteractions(
    modId: number,
    userId?: number
  ) {
    const mod = await prisma.mod.findUnique({
      where: { id: modId },

      select: {
        id: true,

        likesCount: true,
        favoritesCount: true,

        likes: userId
          ? {
              where: { userId },
              select: { userId: true },
            }
          : false,

        favorites: userId
          ? {
              where: { userId },
              select: { userId: true },
            }
          : false,
      },
    });

    if (!mod) {
      throw new NotFoundError("Mod no encontrado");
    }

    return {
      liked: Array.isArray(mod.likes)
        ? mod.likes.length > 0
        : false,

      favorited: Array.isArray(mod.favorites)
        ? mod.favorites.length > 0
        : false,

      likesCount: mod.likesCount,
      favoritesCount: mod.favoritesCount,
    };
  }

  //////////////////////////////////////////////////////
  // TOGGLE LIKE
  //////////////////////////////////////////////////////

  static async toggleLike(
    modId: number,
    userId: number
  ) {
    return prisma.$transaction(async (tx) => {
      const existing =
        await tx.modLike.findUnique({
          where: {
            userId_modId: {
              userId,
              modId,
            },
          },
        });

      if (existing) {
        await tx.modLike.delete({
          where: {
            userId_modId: {
              userId,
              modId,
            },
          },
        });

        const updated = await tx.mod.update({
          where: { id: modId },

          data: {
            likesCount: {
              decrement: 1,
            },
          },

          select: {
            likesCount: true,
            favoritesCount: true,
          },
        });

        return {
          liked: false,
          likesCount: updated.likesCount,
          favoritesCount:
            updated.favoritesCount,
        };
      }

      await tx.modLike.create({
        data: {
          userId,
          modId,
        },
      });

      const updated = await tx.mod.update({
        where: { id: modId },

        data: {
          likesCount: {
            increment: 1,
          },
        },

        select: {
          likesCount: true,
          favoritesCount: true,
        },
      });

      return {
        liked: true,
        likesCount: updated.likesCount,
        favoritesCount:
          updated.favoritesCount,
      };
    });
  }

  //////////////////////////////////////////////////////
  // TOGGLE FAVORITE
  //////////////////////////////////////////////////////

  static async toggleFavorite(
    modId: number,
    userId: number
  ) {
    return prisma.$transaction(async (tx) => {
      const existing =
        await tx.favorite.findUnique({
          where: {
            userId_modId: {
              userId,
              modId,
            },
          },
        });

      if (existing) {
        await tx.favorite.delete({
          where: {
            userId_modId: {
              userId,
              modId,
            },
          },
        });

        const updated = await tx.mod.update({
          where: { id: modId },

          data: {
            favoritesCount: {
              decrement: 1,
            },
          },

          select: {
            likesCount: true,
            favoritesCount: true,
          },
        });

        return {
          favorited: false,
          likesCount: updated.likesCount,
          favoritesCount:
            updated.favoritesCount,
        };
      }

      await tx.favorite.create({
        data: {
          userId,
          modId,
        },
      });

      const updated = await tx.mod.update({
        where: { id: modId },

        data: {
          favoritesCount: {
            increment: 1,
          },
        },

        select: {
          likesCount: true,
          favoritesCount: true,
        },
      });

      return {
        favorited: true,
        likesCount: updated.likesCount,
        favoritesCount:
          updated.favoritesCount,
      };
    });
  }
}