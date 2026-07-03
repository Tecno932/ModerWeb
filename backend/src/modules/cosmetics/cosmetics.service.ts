import { prisma } from "../../lib/prisma";

import {
  BadRequestError,
  NotFoundError,
} from "../../utils/errors";

import {
  CreateCosmeticInput,
  UpdateCosmeticInput,
} from "./cosmetics.types";

export class CosmeticsService {
  //////////////////////////////////////////////////
  // GET ALL
  //////////////////////////////////////////////////

  static async getAll() {
    return prisma.cosmeticItem.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  //////////////////////////////////////////////////
  // GET ONE
  //////////////////////////////////////////////////

  static async getBySlug(
    slug: string
  ) {
    const cosmetic =
      await prisma.cosmeticItem.findUnique({
        where: {
          slug,
        },
      });

    if (!cosmetic) {
      throw new NotFoundError(
        "Cosmético no encontrado"
      );
    }

    return cosmetic;
  }

  //////////////////////////////////////////////////
  // CREATE
  //////////////////////////////////////////////////

  static async create(
    data: CreateCosmeticInput
  ) {
    const exists =
      await prisma.cosmeticItem.findUnique({
        where: {
          slug: data.slug,
        },
      });

    if (exists) {
      throw new BadRequestError(
        "Slug ya existe"
      );
    }

    return prisma.cosmeticItem.create({
      data,
    });
  }

  //////////////////////////////////////////////////
  // UPDATE
  //////////////////////////////////////////////////

  static async update(
    id: number,
    data: UpdateCosmeticInput
  ) {
    const cosmetic =
      await prisma.cosmeticItem.findUnique({
        where: {
          id,
        },
      });

    if (!cosmetic) {
      throw new NotFoundError(
        "Cosmético no encontrado"
      );
    }

    return prisma.cosmeticItem.update({
      where: {
        id,
      },

      data,
    });
  }

  //////////////////////////////////////////////////
  // ACTIVATE
  //////////////////////////////////////////////////

  static async activate(
    id: number
  ) {
    return prisma.cosmeticItem.update({
      where: {
        id,
      },

      data: {
        isActive: true,
      },
    });
  }

  //////////////////////////////////////////////////
  // DEACTIVATE
  //////////////////////////////////////////////////

  static async deactivate(
    id: number
  ) {
    return prisma.cosmeticItem.update({
      where: {
        id,
      },

      data: {
        isActive: false,
      },
    });
  }

  //////////////////////////////////////////////////
  // DELETE
  //////////////////////////////////////////////////

  static async delete(
    id: number
  ) {
    const cosmetic =
      await prisma.cosmeticItem.findUnique({
        where: {
          id,
        },
      });

    if (!cosmetic) {
      throw new NotFoundError(
        "Cosmético no encontrado"
      );
    }

    await prisma.cosmeticItem.delete({
      where: {
        id,
      },
    });

    return {
      message:
        "Cosmético eliminado",
    };
  }
}