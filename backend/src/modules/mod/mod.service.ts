import { prisma } from "../../lib/prisma";

import {
  cacheGet,
  cacheInvalidate,
  cacheSet,
} from "../../lib/cache";

import { TeamService } from "../teams/team.service";

import {
  sanitizeRichText,
  sanitizeText,
} from "../../utils/sanitize";

import {
  ForbiddenError,
  NotFoundError,
  BadRequestError,
} from "../../utils/errors";

import { mapMod } from "./mod.mapper";

import {
  generateUniqueSlug,
} from "./mod.slug";

import {
  parseArray,
} from "./mod.parsers";

import {
  validateCreateMod,
} from "./mod.validation";

import {
  modListInclude,
  modDetailInclude,
} from "./mod.select";

import type {
  CreateModInput,
  UpdateModInput,
} from "./mod.types";

import {
  Loader,
  ModStatus,
  Platform,
  ProjectType,
  Visibility,
} from "@prisma/client";

import { Scopes } from "../../constants/scopes";

export class ModService {

  //////////////////////////////////////////////////
  // CREATE MOD
  //////////////////////////////////////////////////

  static async createMod(
    data: CreateModInput,
    files: any,
    userId: number
  ) {

    validateCreateMod(data);

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

    const categories =
      parseArray(data.categories);

    const tags =
      parseArray(data.tags);

    const safeTitle =
      sanitizeText(data.title);

    const safeSummary =
      sanitizeText(
        data.summary ?? ""
      );

    const safeDescription =
      sanitizeText(
        data.description
      );

    const safeContent =
      sanitizeRichText(
        data.content ?? ""
      );

    const icon =
      files?.icon?.[0];

    const gallery =
      files?.gallery ?? [];

    const slug =
      await generateUniqueSlug(
        user.username,
        safeTitle
      );

    const iconUrl =
      icon
        ? `/uploads/mods/${icon.filename}`
        : null;

    const mod =
      await prisma.mod.create({

        data: {

          //////////////////////////////////////////////////
          // BASIC
          //////////////////////////////////////////////////

          title: safeTitle,

          slug,

          summary:
            safeSummary || null,

          description:
            safeDescription,

          content:
            safeContent || null,

          license:
            data.license ?? null,

          //////////////////////////////////////////////////
          // LINKS
          //////////////////////////////////////////////////

          sourceUrl:
            data.sourceUrl ?? null,

          issuesUrl:
            data.issuesUrl ?? null,

          discordUrl:
            data.discordUrl ?? null,

          websiteUrl:
            data.websiteUrl ?? null,

          wikiUrl:
            data.wikiUrl ?? null,

          donationUrl:
            data.donationUrl ?? null,

          //////////////////////////////////////////////////
          // META
          //////////////////////////////////////////////////

          platform:
            data.platform as Platform,

          type:
            data.type as ProjectType,

          loader:
            (data.loader as Loader) ??
            null,

          visibility:
            (data.visibility as Visibility) ??
            Visibility.PUBLIC,

          status:
            ModStatus.DRAFT,

          categories,

          //////////////////////////////////////////////////
          // MEDIA
          //////////////////////////////////////////////////

          icon: iconUrl,

          images: {
            create: gallery.map(
              (
                file: Express.Multer.File
              ) => ({
                url:
                  `/uploads/mods/${file.filename}`,

                thumb:
                  `/uploads/mods/${file.filename}`,

                isCover: false,
              })
            ),
          },

          //////////////////////////////////////////////////
          // TAGS
          //////////////////////////////////////////////////

          tags: {
            create: tags.map(
              (name) => ({
                tag: {
                  connectOrCreate: {

                    where: {
                      name,
                    },

                    create: {
                      name,
                    },

                  },
                },
              })
            ),
          },

          //////////////////////////////////////////////////
          // AUTHOR
          //////////////////////////////////////////////////

          authorId:
            userId,

        },

        include:
          modListInclude,

      });

    await cacheInvalidate(
      "mods:*"
    );

    return mapMod(mod);

  }

  //////////////////////////////////////////////////
  // GET MODS
  //////////////////////////////////////////////////

  static async getMods(
    query: any
  ) {

    const page =
      Number(query.page) || 1;

    const limit =
      Number(query.limit) || 12;

    const search =
      query.query?.trim() ?? "";

    const platform =
      query.platform;

    const loader =
      query.loader;

    const type =
      query.type;

    const category =
      query.category;

    const version =
      query.version;

    const sort =
      query.sort ?? "newest";

    if (page < 1) {
      throw new BadRequestError(
        "page inválida"
      );
    }

    if (
      limit < 1 ||
      limit > 50
    ) {
      throw new BadRequestError(
        "limit inválido"
      );
    }

    const where: any = {
      deletedAt: null,
    };

    if (search) {

      where.OR = [

        {
          title: {
            contains: search,
            mode: "insensitive",
          },
        },

        {
          description: {
            contains: search,
            mode: "insensitive",
          },
        },

        {
          tags: {
            some: {
              tag: {
                name: {
                  contains: search,
                  mode: "insensitive",
                },
              },
            },
          },
        },

      ];

    }

    if (platform) {
      where.platform = platform;
    }

    if (loader) {
      where.loader = loader;
    }

    if (type) {
      where.type = type;
    }

    if (category) {

      where.categories = {
        has: category,
      };

    }

    if (version) {

      where.versions = {
        some: {
          minecraftVersion:
            version,
        },
      };

    }

    if (query.authorId) {

      where.authorId =
        Number(query.authorId);

    }

    const orderBy =

      sort === "popular"

        ? {
            likesCount: "desc" as const,
          }

        : sort === "downloads"

        ? {
            downloads: "desc" as const,
          }

        : {
            createdAt: "desc" as const,
          };

    const cacheKey =

      `mods:list:
page=${page}:
limit=${limit}:
query=${search}:
platform=${platform}:
loader=${loader}:
type=${type}:
category=${category}:
version=${version}:
sort=${sort}`;

    const cached =
      await cacheGet(cacheKey);

    if (cached) {
      return cached;
    }

    const skip =
      (page - 1) * limit;

    const [
      mods,
      total,
    ] =
      await Promise.all([

        prisma.mod.findMany({

          where,

          skip,

          take: limit,

          orderBy,

          include:
            modListInclude,

        }),

        prisma.mod.count({
          where,
        }),

      ]);

    const result = {

      data:
        mods.map(mapMod),

      meta: {

        total,

        page,

        limit,

        totalPages:
          Math.ceil(
            total / limit
          ),

      },

    };

    await cacheSet(
      cacheKey,
      result
    );

    return result;

  }

  //////////////////////////////////////////////////
  // GET MOD
  //////////////////////////////////////////////////

  static async getModBySlug(
    slug: string,
    userId?: number,
    reqIp?: string
  ) {

    const mod =
      await prisma.mod.findFirst({

        where: {
          slug,
          deletedAt: null,
        },

        include:
          modDetailInclude,

      });

    if (!mod) {
      throw new NotFoundError(
        "Mod no encontrado"
      );
    }

    const viewKey =
      `mod:view:${mod.id}:${userId ?? reqIp}`;

    const viewed =
      await cacheGet(viewKey);

    if (!viewed) {

      await prisma.mod.update({

        where: {
          id: mod.id,
        },

        data: {
          views: {
            increment: 1,
          },
        },

      });

      await cacheSet(
        viewKey,
        true,
        60 * 30
      );

      mod.views++;

    }

    return mapMod(
      mod,
      userId
    );

  }

  //////////////////////////////////////////////////
  // UPDATE
  //////////////////////////////////////////////////

  static async updateMod(
    id: number,
    data: UpdateModInput,
    userId: number
  ) {

    const mod =
      await prisma.mod.findUnique({

        where: {
          id,
        },

      });

    if (
      !mod ||
      mod.deletedAt
    ) {
      throw new NotFoundError(
        "Mod no encontrado"
      );
    }

    const allowed =
      await TeamService.hasScope(
        userId,
        mod,
        Scopes.MOD_UPDATE
      );

    if (!allowed) {
      throw new ForbiddenError(
        "No autorizado"
      );
    }

    const updated =
      await prisma.mod.update({

        where: {
          id,
        },

        data,

      });

    await cacheInvalidate(
      "mods:*"
    );

    return updated;

  }

  //////////////////////////////////////////////////
  // DELETE
  //////////////////////////////////////////////////

  static async deleteMod(
    id: number,
    userId: number
  ) {

    const mod =
      await prisma.mod.findUnique({

        where: {
          id,
        },

      });

    if (
      !mod ||
      mod.deletedAt
    ) {
      throw new NotFoundError(
        "Mod no encontrado"
      );
    }

    const allowed =
      await TeamService.hasScope(
        userId,
        mod,
        Scopes.MOD_DELETE
      );

    if (!allowed) {
      throw new ForbiddenError(
        "No autorizado"
      );
    }

    await prisma.mod.update({

      where: {
        id,
      },

      data: {
        deletedAt:
          new Date(),
      },

    });

    await cacheInvalidate(
      "mods:*"
    );

    return {
      success: true,
    };

  }

}