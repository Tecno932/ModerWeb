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

          avatar: true,
          bio: true,

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

    //////////////////////////////////////////////////
    // UPDATE
    //////////////////////////////////////////////////

    const updatedUser =
      await prisma.user.update({
        where: {
          id: userId,
        },

        data: {
          username:
            username ??
            undefined,

          bio:
            bio ??
            undefined,
        },

        select: {
          id: true,
          username: true,
          email: true,

          avatar: true,
          bio: true,

          role: true,

          isVerified: true,

          createdAt: true,
          updatedAt: true,

          lastLoginAt: true,
        },
      });

    return updatedUser;
  }

  //////////////////////////////////////////////////
  // GET PUBLIC PROFILE
  //////////////////////////////////////////////////

  static async getPublicProfile(
    username: string
  ) {
    const user =
      await prisma.user.findUnique({
        where: {
          username,
        },

        select: {
          id: true,

          username: true,

          avatar: true,

          bio: true,

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

    return {
      id: user.id,

      username:
        user.username,

      avatar:
        user.avatar,

      bio: user.bio,

      createdAt:
        user.createdAt,

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
  
  //////////////////////////////////////////////////
  // UPDATE AVATAR
  //////////////////////////////////////////////////

  static async updateAvatar(
    userId: number,
    avatar: string
  ) {
    if (!avatar?.trim()) {
      throw new BadRequestError(
        "Avatar requerido"
      );
    }

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

    return prisma.user.update({
      where: {
        id: userId,
      },

      data: {
        avatar,
      },

      select: {
        id: true,
        username: true,
        email: true,

        avatar: true,
        bio: true,

        role: true,

        isVerified: true,

        createdAt: true,
        updatedAt: true,

        lastLoginAt: true,
      },
    });
  }
}