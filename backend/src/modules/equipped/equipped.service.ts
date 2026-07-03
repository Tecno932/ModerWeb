import {
  CosmeticType,
} from "@prisma/client";

import { prisma }
  from "../../lib/prisma";

import {
  BadRequestError,
  NotFoundError,
} from "../../utils/errors";

export class EquippedService {
  //////////////////////////////////////////////////
  // GET MY EQUIPPED
  //////////////////////////////////////////////////

  static async getMyEquipped(
    userId: number
  ) {
    const profile =
      await prisma.userProfile.findUnique({
        where: {
          userId,
        },

        include: {
          equippedCosmetics: {
            include: {
              cosmetic: true,
            },
          },
        },
      });

    if (!profile) {
      throw new NotFoundError(
        "Perfil no encontrado"
      );
    }

    return profile.equippedCosmetics;
  }

  //////////////////////////////////////////////////
  // GET USER EQUIPPED
  //////////////////////////////////////////////////

  static async getUserEquipped(
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
              equippedCosmetics: {
                include: {
                  cosmetic: true,
                },
              },
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
      user.profile
        ?.equippedCosmetics ?? []
    );
  }

  //////////////////////////////////////////////////
  // EQUIP
  //////////////////////////////////////////////////

  static async equip(
    userId: number,
    cosmeticId: number
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

    const cosmetic =
      await prisma.cosmeticItem.findUnique({
        where: {
          id: cosmeticId,
        },
      });

    if (!cosmetic) {
      throw new NotFoundError(
        "Cosmético no encontrado"
      );
    }

    if (!cosmetic.isActive) {
      throw new BadRequestError(
        "Cosmético inactivo"
      );
    }

    const owned =
      await prisma.userInventory.findUnique({
        where: {
          userId_itemId: {
            userId,
            itemId:
              cosmetic.id,
          },
        },
      });

    if (!owned) {
      throw new BadRequestError(
        "No posees este cosmético"
      );
    }

    return prisma.equippedCosmetic.upsert({
      where: {
        profileId_type: {
          profileId:
            profile.id,

          type:
            cosmetic.type,
        },
      },

      create: {
        profileId:
          profile.id,

        cosmeticId:
          cosmetic.id,

        type:
          cosmetic.type,
      },

      update: {
        cosmeticId:
          cosmetic.id,
      },
    });
  }

  //////////////////////////////////////////////////
  // UNEQUIP
  //////////////////////////////////////////////////

  static async unequip(
    userId: number,
    type: CosmeticType
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

    await prisma.equippedCosmetic.delete({
      where: {
        profileId_type: {
          profileId:
            profile.id,

          type,
        },
      },
    });

    return {
      message:
        "Cosmético desequipado",
    };
  }
}