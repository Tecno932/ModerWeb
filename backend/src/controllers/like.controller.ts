import { prisma } from "../lib/prisma";
import { getRedis } from "../lib/redis";

export class LikeController {
  /**
   * Toggle like (like / unlike)
   */
  static async toggleLike(userId: number, modId: number) {
    try {
      const result = await prisma.$transaction(async (tx) => {
        const existingLike = await tx.modLike.findUnique({
          where: {
            userId_modId: { userId, modId },
          },
        });

        if (existingLike) {
          await tx.modLike.delete({
            where: {
              userId_modId: { userId, modId },
            },
          });

          await tx.mod.update({
            where: { id: modId },
            data: {
              likesCount: { decrement: 1 },
            },
          });

          return { liked: false };
        }

        await tx.modLike.create({
          data: { userId, modId },
        });

        await tx.mod.update({
          where: { id: modId },
          data: {
            likesCount: { increment: 1 },
          },
        });

        return { liked: true };
      });

      // 🔥 INVALIDAR CACHE
      const redis = getRedis();

      if (redis) {
        await redis.del("mods:list");
        await redis.del("mods:trending");
      }

      return result;
    } catch (error) {
      console.error("Error toggling like:", error);
      throw new Error("Error toggling like");
    }
  }

  /**
   * Get likes count
   */
  static async getLikesCount(modId: number) {
    try {
      const count = await prisma.modLike.count({
        where: { modId },
      });

      return count;
    } catch (error) {
      console.error("Error getting likes count:", error);
      throw new Error("Error getting likes count");
    }
  }

  /**
   * Check if user liked a mod
   */
  static async isLiked(userId: number, modId: number) {
    try {
      const like = await prisma.modLike.findUnique({
        where: {
          userId_modId: {
            userId,
            modId,
          },
        },
      });

      return !!like;
    } catch (error) {
      console.error("Error checking like:", error);
      throw new Error("Error checking like");
    }
  }
}