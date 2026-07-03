import { prisma } from "../../lib/prisma";
import {
  BadRequestError,
  NotFoundError,
} from "../../utils/errors";

export class FollowsService {
  static async followUser(
    followerId: number,
    username: string
  ) {
    const target =
      await prisma.user.findUnique({
        where: {
          username,
        },
      });

    if (!target) {
      throw new NotFoundError(
        "Usuario no encontrado"
      );
    }

    if (target.id === followerId) {
      throw new BadRequestError(
        "No puedes seguirte a ti mismo"
      );
    }

    const exists =
      await prisma.follow.findUnique({
        where: {
          followerId_followingId: {
            followerId,
            followingId: target.id,
          },
        },
      });

    if (exists) {
      throw new BadRequestError(
        "Ya sigues a este usuario"
      );
    }

    await prisma.follow.create({
      data: {
        followerId,
        followingId: target.id,
      },
    });

    return {
      message: "Usuario seguido",
    };
  }

  static async unfollowUser(
    followerId: number,
    username: string
  ) {
    const target =
      await prisma.user.findUnique({
        where: {
          username,
        },
      });

    if (!target) {
      throw new NotFoundError(
        "Usuario no encontrado"
      );
    }

    await prisma.follow.delete({
      where: {
        followerId_followingId: {
          followerId,
          followingId: target.id,
        },
      },
    });

    return {
      message: "Usuario dejado de seguir",
    };
  }

  static async getFollowers(
    username: string
  ) {
    const user =
      await prisma.user.findUnique({
        where: {
          username,
        },
      });

    if (!user) {
      throw new NotFoundError(
        "Usuario no encontrado"
      );
    }

    const followers =
      await prisma.follow.findMany({
        where: {
          followingId: user.id,
        },

        include: {
          follower: {
            select: {
              id: true,
              username: true,
            },
          },
        },
      });

    return followers.map(
      (f) => f.follower
    );
  }

  static async getFollowing(
    username: string
  ) {
    const user =
      await prisma.user.findUnique({
        where: {
          username,
        },
      });

    if (!user) {
      throw new NotFoundError(
        "Usuario no encontrado"
      );
    }

    const following =
      await prisma.follow.findMany({
        where: {
          followerId: user.id,
        },

        include: {
          following: {
            select: {
              id: true,
              username: true,
            },
          },
        },
      });

    return following.map(
      (f) => f.following
    );
  }
}