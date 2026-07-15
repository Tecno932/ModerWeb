import { prisma } from "../../lib/prisma";

import { NotFoundError } from "../../utils/errors";

import type {
  ToggleInteractionInput,
} from "./interactions.types";

export class InteractionsService {

  //////////////////////////////////////////////////////
  // GET INTERACTIONS
  //////////////////////////////////////////////////////

  static async getInteractions(
    modId: number,
    userId?: number
  ) {

    const mod =
      await prisma.mod.findUnique({
        where: {
          id: modId,
        },

        select: {
          likesCount: true,

          favoritesCount: true,

          likes: userId
            ? {
                where: { userId },
                select: {
                  userId: true,
                },
              }
            : false,

          favorites: userId
            ? {
                where: { userId },
                select: {
                  userId: true,
                },
              }
            : false,
        },
      });

    if (!mod) {
      throw new NotFoundError(
        "Mod no encontrado"
      );
    }

    return {
      liked:
        Array.isArray(mod.likes) &&
        mod.likes.length > 0,

      favorited:
        Array.isArray(mod.favorites) &&
        mod.favorites.length > 0,

      likesCount:
        mod.likesCount,

      favoritesCount:
        mod.favoritesCount,
    };
  }

  //////////////////////////////////////////////////////
  // PRIVATE
  //////////////////////////////////////////////////////

  private static async updateCounts(
    tx: any,
    modId: number,
    field: "likesCount" | "favoritesCount",
    increment: boolean
  ) {
    return tx.mod.update({
      where: {
        id: modId,
      },

      data: {
        [field]: {
          [increment
            ? "increment"
            : "decrement"]: 1,
        },
      },

      select: {
        likesCount: true,
        favoritesCount: true,
      },
    });
  }

  //////////////////////////////////////////////////////
  // TOGGLE LIKE
  //////////////////////////////////////////////////////

  static async toggleLike({
    modId,
    userId,
  }: ToggleInteractionInput) {

    return prisma.$transaction(
      async (tx) => {

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

          const updated =
            await this.updateCounts(
              tx,
              modId,
              "likesCount",
              false
            );

          return {
            liked: false,

            likesCount:
              updated.likesCount,

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

        const updated =
          await this.updateCounts(
            tx,
            modId,
            "likesCount",
            true
          );

        return {
          liked: true,

          likesCount:
            updated.likesCount,

          favoritesCount:
            updated.favoritesCount,
        };
      }
    );
  }

  //////////////////////////////////////////////////////
  // TOGGLE FAVORITE
  //////////////////////////////////////////////////////

  static async toggleFavorite({
    modId,
    userId,
  }: ToggleInteractionInput) {

    return prisma.$transaction(
      async (tx) => {

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

          const updated =
            await this.updateCounts(
              tx,
              modId,
              "favoritesCount",
              false
            );

          return {
            favorited: false,

            likesCount:
              updated.likesCount,

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

        const updated =
          await this.updateCounts(
            tx,
            modId,
            "favoritesCount",
            true
          );

        return {
          favorited: true,

          likesCount:
            updated.likesCount,

          favoritesCount:
            updated.favoritesCount,
          };
      }
    );
  }
}