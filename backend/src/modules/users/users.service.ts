import { prisma } from "../../lib/prisma";

import {
  BadRequestError,
  NotFoundError,
} from "../../utils/errors";

import { UpdateProfileInput } from "./users.types";

export class UsersService {
  //////////////////////////////////////////////////
  // GET CURRENT PROFILE
  //////////////////////////////////////////////////

  static async getCurrentProfile(
    userId: number
  ) {
    const user =
      await prisma.user.findUnique({
        where: {
          id: userId,
        },

        select: {
          id: true,
          username: true,
          email: true,

        profile: {
          select: {
            displayName: true,

            avatarUrl: true,
            bannerUrl: true,

            bio: true,

            accentColor: true,

            socials: true,
            equippedCosmetics: {
              include: {
                cosmetic: true,
              },
            }
          },
        },

          role: true,

          isVerified: true,

          createdAt: true,
          updatedAt: true,

          lastLoginAt: true,

          _count: {
            select: {
              mods: true,
              comments: true,
              followers: true,
              following: true,
            },
          },
        },
      });

    if (!user) {
      throw new NotFoundError(
        "Usuario no encontrado"
      );
    }

    const {
      _count,
      ...safeUser
    } = user;

    return {
      ...safeUser,

      stats: {
        mods: _count.mods,
        comments: _count.comments,
        followers: _count.followers,
        following: _count.following,
      },
    };
  }

  //////////////////////////////////////////////////
  // UPDATE PROFILE
  //////////////////////////////////////////////////

  static async updateProfile(
    userId: number,
    data: UpdateProfileInput
  ) {
    const user =
      await prisma.user.findUnique({
        where: {
          id: userId,
        },
      });

    if (!user) {
      throw new NotFoundError(
        "Usuario no encontrado"
      );
    }

    const username =
      data.username?.trim();

    const bio =
      data.bio?.trim();

    //////////////////////////////////////////////////
    // USERNAME
    //////////////////////////////////////////////////

    if (username) {
      if (username.length < 3) {
        throw new BadRequestError(
          "Username muy corto"
        );
      }

      if (username.length > 30) {
        throw new BadRequestError(
          "Username muy largo"
        );
      }

      const existingUser =
        await prisma.user.findFirst({
          where: {
            username,

            NOT: {
              id: userId,
            },
          },
        });

      if (existingUser) {
        throw new BadRequestError(
          "Username ya existe"
        );
      }
    }

    //////////////////////////////////////////////////
    // BIO
    //////////////////////////////////////////////////

    if (
      bio &&
      bio.length > 500
    ) {
      throw new BadRequestError(
        "La biografía es demasiado larga"
      );
    }

    if (username) {
      await prisma.user.update({
        where: {
          id: userId,
        },

        data: {
          username,
        },
      });
    }

    //////////////////////////////////////////////////
    // UPDATE
    //////////////////////////////////////////////////

    const updatedUser =
      await prisma.userProfile.upsert({
        where: {
          userId,
        },

        create: {
          userId,

          displayName:
            data.displayName,

          bio:
            data.bio,

          avatarUrl:
            data.avatarUrl,

          bannerUrl:
            data.bannerUrl,

          accentColor:
            data.accentColor,
        },

        update: {
          displayName:
            data.displayName,

          bio:
            data.bio,

          avatarUrl:
            data.avatarUrl,

          bannerUrl:
            data.bannerUrl,

          accentColor:
            data.accentColor,
        },
      });

    return updatedUser;
  }

  //////////////////////////////////////////////////
  // GET PUBLIC PROFILE
  //////////////////////////////////////////////////

  static async getPublicProfile(
    username: string,
    viewerId?: number
  ) {
    const user =
      await prisma.user.findUnique({
        where: {
          username,
        },

        select: {
          id: true,

          username: true,

        profile: {
          select: {
            displayName: true,

            avatarUrl: true,

            bannerUrl: true,

            bio: true,

            accentColor: true,

            socials: true,
            equippedCosmetics: {
              include: {
                cosmetic: true,
              },
            }
          },
        },

          createdAt: true,

          _count: {
            select: {
              mods: true,
              comments: true,
              followers: true,
              following: true,
            },
          },
        },
      });

    if (!user) {
      throw new NotFoundError(
        "Usuario no encontrado"
      );
    }

    let isFollowing = false;

    if (
      viewerId &&
      viewerId !== user.id
    ) {
      const follow =
        await prisma.follow.findUnique({
          where: {
            followerId_followingId: {
              followerId: viewerId,
              followingId: user.id,
            },
          },
        });

      isFollowing = !!follow;
    }

    return {
      id: user.id,

      username: user.username,

      profile: {
        displayName:
          user.profile?.displayName ?? null,

        avatarUrl:
          user.profile?.avatarUrl ?? null,

        bannerUrl:
          user.profile?.bannerUrl ?? null,

        bio:
          user.profile?.bio ?? null,

        accentColor:
          user.profile?.accentColor ?? null,

        socials:
          user.profile?.socials ?? [],

        equippedCosmetics:
          user.profile?.equippedCosmetics ?? [],
      },

      createdAt:
        user.createdAt,

      isFollowing,

      stats: {
        mods:
          user._count.mods,

        comments:
          user._count.comments,

        followers:
          user._count.followers,

        following:
          user._count.following,
      },
    };
  }
}