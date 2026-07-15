import { prisma } from "../../lib/prisma";
import { cacheInvalidate } from "../../lib/cache";

import type {
  CreateVersionInput,
} from "./version.types";

import { Scopes } from "../../constants/scopes";
import { TeamService } from "../teams/team.service";

import { sanitizeRichText } from "../../utils/sanitize";

import {
  ForbiddenError,
  NotFoundError,
} from "../../utils/errors";

export class VersionService {
  static async createVersion(
    data: CreateVersionInput,
    userId: number,
    modId: number
  ) {
    const mod = await prisma.mod.findUnique({
      where: {
        id: modId,
      },
    });

    if (!mod || mod.deletedAt) {
      throw new NotFoundError(
        "Mod no encontrado"
      );
    }

    const allowed = await TeamService.hasScope(
      userId,
      mod,
      Scopes.VERSION_CREATE
    );

    if (!allowed) {
      throw new ForbiddenError(
        "No autorizado"
      );
    }

    // ✅ sanitización segura
    const safeChangelog = sanitizeRichText(
      data.changelog || ""
    );

    const version =
      await prisma.modVersion.create({
        data: {
          modId,

          version: data.version,

          minecraftVersion:
            data.minecraftVersion,

          loader: data.loader,

          changelog: safeChangelog,
        },
      });

    // ✅ invalidamos cache si Redis existe
    await cacheInvalidate("mods:*");

    return version;
  }

  static async getVersions(modId: number) {
    return prisma.modVersion.findMany({
      where: {
        modId,
      },

      include: {
        files: true,
      },
    });
  }

  static async updateVersion(
    versionId: number,
    userId: number,
    versionName: string
  ) {

    const version =
      await prisma.modVersion.findUnique({
        where: {
          id: versionId,
        },
        include: {
          mod: true,
        },
      });

    if (!version) {
      throw new NotFoundError(
        "No existe"
      );
    }

    const allowed =
      await TeamService.hasScope(
        userId,
        version.mod,
        Scopes.VERSION_CREATE
      );

    if (!allowed) {
      throw new ForbiddenError(
        "No autorizado"
      );
    }

    const updated =
      await prisma.modVersion.update({
        where: {
          id: versionId,
        },
        data: {
          version: versionName,
        },
      });

    await cacheInvalidate("mods:*");

    return updated;
  }

  static async deleteVersion(
    versionId: number,
    userId: number
  ) {

    const version =
      await prisma.modVersion.findUnique({
        where: {
          id: versionId,
        },
        include: {
          mod: true,
        },
      });

    if (!version) {
      throw new NotFoundError(
        "No existe"
      );
    }

    const allowed =
      await TeamService.hasScope(
        userId,
        version.mod,
        Scopes.VERSION_CREATE
      );

    if (!allowed) {
      throw new ForbiddenError(
        "No autorizado"
      );
    }

    await prisma.modVersion.delete({
      where: {
        id: versionId,
      },
    });

    await cacheInvalidate("mods:*");

    return {
      success: true,
    };
  }
}