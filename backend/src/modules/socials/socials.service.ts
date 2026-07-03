import { SocialPlatform } from "@prisma/client";

import { prisma } from "../../lib/prisma";

import {
  BadRequestError,
  NotFoundError,
} from "../../utils/errors";

import { UpsertSocialInput }
  from "./socials.types";

const SOCIAL_PATTERNS:
  Record<SocialPlatform, RegExp> = {
  GITHUB:
    /^https?:\/\/(www\.)?github\.com\/.+$/i,

  DISCORD:
    /^https?:\/\/(www\.)?(discord\.gg|discord\.com)\/.+$/i,

  YOUTUBE:
    /^https?:\/\/(www\.)?(youtube\.com|youtu\.be)\/.+$/i,

  INSTAGRAM:
    /^https?:\/\/(www\.)?instagram\.com\/.+$/i,

  PATREON:
    /^https?:\/\/(www\.)?patreon\.com\/.+$/i,

  KOFI:
    /^https?:\/\/(www\.)?ko-fi\.com\/.+$/i,

  TWITCH:
    /^https?:\/\/(www\.)?twitch\.tv\/.+$/i,

  X:
    /^https?:\/\/(www\.)?(x\.com|twitter\.com)\/.+$/i,

  TIKTOK:
    /^https?:\/\/(www\.)?tiktok\.com\/.+$/i,

  WEBSITE:
    /^https?:\/\/.+$/i,
};

export class SocialsService {
  //////////////////////////////////////////////////
  // GET MY SOCIALS
  //////////////////////////////////////////////////

  static async getMySocials(
    userId: number
  ) {
    const profile =
      await prisma.userProfile.findUnique({
        where: {
          userId,
        },

        include: {
          socials: true,
        },
      });

    if (!profile) {
      throw new NotFoundError(
        "Perfil no encontrado"
      );
    }

    return profile.socials;
  }

  //////////////////////////////////////////////////
  // GET USER SOCIALS
  //////////////////////////////////////////////////

  static async getUserSocials(
    username: string
  ) {
    const user =
      await prisma.user.findUnique({
        where: {
          username,
        },

        include: {
          profile: {
            include: {
              socials: true,
            },
          },
        },
      });

    if (!user) {
      throw new NotFoundError(
        "Usuario no encontrado"
      );
    }

    return (
      user.profile?.socials ??
      []
    );
  }

  //////////////////////////////////////////////////
  // UPSERT SOCIAL
  //////////////////////////////////////////////////

  static async upsertSocial(
    userId: number,
    data: UpsertSocialInput
  ) {
    const profile =
      await prisma.userProfile.findUnique({
        where: {
          userId,
        },
      });

    if (!profile) {
      throw new NotFoundError(
        "Perfil no encontrado"
      );
    }

    const pattern =
      SOCIAL_PATTERNS[
        data.platform
      ];

    if (
      !pattern ||
      !pattern.test(data.url)
    ) {
      throw new BadRequestError(
        "URL inválida para esa plataforma"
      );
    }

    return prisma.profileSocial.upsert({
      where: {
        profileId_platform: {
          profileId: profile.id,
          platform:
            data.platform,
        },
      },

      create: {
        profileId:
          profile.id,

        platform:
          data.platform,

        url:
          data.url,
      },

      update: {
        url:
          data.url,
      },
    });
  }

  //////////////////////////////////////////////////
  // DELETE SOCIAL
  //////////////////////////////////////////////////

  static async deleteSocial(
    userId: number,
    platform: SocialPlatform
  ) {
    const profile =
      await prisma.userProfile.findUnique({
        where: {
          userId,
        },
      });

    if (!profile) {
      throw new NotFoundError(
        "Perfil no encontrado"
      );
    }

    await prisma.profileSocial.delete({
      where: {
        profileId_platform: {
          profileId:
            profile.id,

          platform,
        },
      },
    });

    return {
      message:
        "Red social eliminada",
    };
  }
}