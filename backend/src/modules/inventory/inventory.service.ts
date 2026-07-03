import { prisma }
  from "../../lib/prisma";

import {
  NotFoundError,
} from "../../utils/errors";

import {
  GrantInventoryInput,
  RemoveInventoryInput,
} from "./inventory.types";

export class InventoryService {
  //////////////////////////////////////////////////
  // MY INVENTORY
  //////////////////////////////////////////////////

  static async getMyInventory(
    userId: number
  ) {
    return prisma.userInventory.findMany({
      where: {
        userId,
      },

      include: {
        item: true,
      },

      orderBy: {
        obtainedAt: "desc",
      },
    });
  }

  //////////////////////////////////////////////////
  // PUBLIC INVENTORY
  //////////////////////////////////////////////////

  static async getUserInventory(
    username: string
  ) {
    const user =
      await prisma.user.findUnique({
        where: {
          username,
        },

        include: {
          profile: true,
        },
      });

    if (!user) {
      throw new NotFoundError(
        "Usuario no encontrado"
      );
    }

    if (
      user.profile &&
      !user.profile.inventoryPublic
    ) {
      throw new NotFoundError(
        "Inventario privado"
      );
    }

    return prisma.userInventory.findMany({
      where: {
        userId: user.id,
      },

      include: {
        item: true,
      },

      orderBy: {
        obtainedAt: "desc",
      },
    });
  }

  //////////////////////////////////////////////////
  // GRANT
  //////////////////////////////////////////////////

  static async grantItem(
    data: GrantInventoryInput
  ) {
    const user =
      await prisma.user.findUnique({
        where: {
          username:
            data.username,
        },
      });

    if (!user) {
      throw new NotFoundError(
        "Usuario no encontrado"
      );
    }

    const item =
      await prisma.cosmeticItem.findUnique({
        where: {
          id: data.itemId,
        },
      });

    if (!item) {
      throw new NotFoundError(
        "Cosmético no encontrado"
      );
    }

    return prisma.userInventory.upsert({
      where: {
        userId_itemId: {
          userId: user.id,
          itemId: item.id,
        },
      },

      create: {
        userId: user.id,

        itemId: item.id,

        quantity:
          data.quantity ?? 1,
      },

      update: {
        quantity: {
          increment:
            data.quantity ?? 1,
        },
      },
    });
  }

  //////////////////////////////////////////////////
  // REMOVE
  //////////////////////////////////////////////////

  static async removeItem(
    data: RemoveInventoryInput
  ) {
    const user =
      await prisma.user.findUnique({
        where: {
          username:
            data.username,
        },
      });

    if (!user) {
      throw new NotFoundError(
        "Usuario no encontrado"
      );
    }

    await prisma.userInventory.delete({
      where: {
        userId_itemId: {
          userId: user.id,
          itemId: data.itemId,
        },
      },
    });

    return {
      message:
        "Cosmético removido",
    };
  }

  //////////////////////////////////////////////////
  // CHECK OWNERSHIP
  //////////////////////////////////////////////////

  static async checkOwnership(
    userId: number,
    itemId: number
  ) {
    const inventory =
      await prisma.userInventory.findUnique({
        where: {
          userId_itemId: {
            userId,
            itemId,
          },
        },
      });

    return {
      owned: !!inventory,

      quantity:
        inventory?.quantity ?? 0,
    };
  }
}