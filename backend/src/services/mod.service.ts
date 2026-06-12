import { prisma } from "../lib/prisma";

import {
  cacheGet,
  cacheInvalidate,
  cacheSet,
} from "../lib/cache";

import { TeamService } from "./team.service";

import {
  sanitizeRichText,
  sanitizeText,
} from "../utils/sanitize";

import {
  BadRequestError,
  ForbiddenError,
  NotFoundError,
} from "../utils/errors";

import { generateSlug } from "../utils/slug";

import { mapMod } from "../mappers/mod.mapper";

import { Scopes } from "../constants/scopes";

import {
  Loader,
  ModStatus,
  Platform,
  ProjectType,
  Visibility,
} from "@prisma/client";

export class ModService {
  //////////////////////////////////////////////////
  // CREATE MOD
  //////////////////////////////////////////////////

  static async createMod(
    data: any,
    files: any,
    userId: number
  ) {
    //////////////////////////////////////////////////
    // USER
    //////////////////////////////////////////////////

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

    //////////////////////////////////////////////////
    // EXTRACT DATA
    //////////////////////////////////////////////////

    const {
      title,
      summary,
      description,
      content,
      license,

      sourceUrl,
      issuesUrl,
      discordUrl,
      websiteUrl,
      wikiUrl,
      donationUrl,

      platform,
      type,
      loader,
      visibility,
    } = data;

    //////////////////////////////////////////////////
    // PARSE ARRAYS
    //////////////////////////////////////////////////

    const categories =
      typeof data.categories ===
      "string"
        ? JSON.parse(
            data.categories || "[]"
          )
        : data.categories || [];

    const tags =
      typeof data.tags === "string"
        ? JSON.parse(
            data.tags || "[]"
          )
        : data.tags || [];

    //////////////////////////////////////////////////
    // VALIDATION
    //////////////////////////////////////////////////

    if (!title) {
      throw new BadRequestError(
        "Title requerido"
      );
    }

    if (!description) {
      throw new BadRequestError(
        "Description requerida"
      );
    }

    if (!platform) {
      throw new BadRequestError(
        "Platform requerida"
      );
    }

    if (!type) {
      throw new BadRequestError(
        "Type requerido"
      );
    }

    //////////////////////////////////////////////////
    // SANITIZE
    //////////////////////////////////////////////////

    const safeTitle =
      sanitizeText(title);

    const safeSummary =
      sanitizeText(summary || "");

    const safeDescription =
      sanitizeText(description);

    const safeContent =
      sanitizeRichText(
        content || ""
      );

    //////////////////////////////////////////////////
    // FILES
    //////////////////////////////////////////////////

    const icon =
      files?.icon?.[0];

    const gallery =
      files?.gallery || [];

    //////////////////////////////////////////////////
    // SLUG
    //////////////////////////////////////////////////

    let slug =
      generateSlug(
        user.username,
        safeTitle
      );

    let counter = 1;

    while (
      await prisma.mod.findUnique({
        where: { slug },
      })
    ) {
      slug =
        generateSlug(
          user.username,
          safeTitle
        ) +
        "-" +
        counter;

      counter++;
    }

    //////////////////////////////////////////////////
    // ICON URL
    //////////////////////////////////////////////////

    const iconUrl = icon
      ? `/uploads/mods/${icon.filename}`
      : null;

    //////////////////////////////////////////////////
    // CREATE MOD
    //////////////////////////////////////////////////

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
            license || null,

          //////////////////////////////////////////////////
          // LINKS
          //////////////////////////////////////////////////

          sourceUrl:
            sourceUrl || null,

          issuesUrl:
            issuesUrl || null,

          discordUrl:
            discordUrl || null,

          websiteUrl:
            websiteUrl || null,

          wikiUrl:
            wikiUrl || null,

          donationUrl:
            donationUrl || null,

          //////////////////////////////////////////////////
          // META
          //////////////////////////////////////////////////

          platform:
            platform as Platform,

          type:
            type as ProjectType,

          loader:
            loader
              ? (loader as Loader)
              : null,

          visibility:
            (visibility as Visibility) ||
            Visibility.PUBLIC,

          status:
            ModStatus.DRAFT,

          categories,

          //////////////////////////////////////////////////
          // ICON
          //////////////////////////////////////////////////

          icon: iconUrl,

          //////////////////////////////////////////////////
          // AUTHOR
          //////////////////////////////////////////////////

          authorId: userId,

          //////////////////////////////////////////////////
          // TAGS
          //////////////////////////////////////////////////

          tags: {
            create: tags.map(
              (tagName: string) => ({
                tag: {
                  connectOrCreate:
                    {
                      where: {
                        name: tagName,
                      },

                      create: {
                        name: tagName,
                      },
                    },
                },
              })
            ),
          },

          //////////////////////////////////////////////////
          // GALLERY
          //////////////////////////////////////////////////

          images: {
            create: gallery.map(
              (
                file: Express.Multer.File
              ) => ({
                url: `/uploads/mods/${file.filename}`,

                thumb: `/uploads/mods/${file.filename}`,

                isCover: false,
              })
            ),
          },
        },

        include: {
          //////////////////////////////////////////////////
          // RELATIONS
          //////////////////////////////////////////////////

          images: true,

          tags: {
            include: {
              tag: true,
            },
          },

          author: {
            select: {
              id: true,
              username: true,
              avatar: true,
            },
          },
        },
      });

    //////////////////////////////////////////////////
    // CACHE
    //////////////////////////////////////////////////

    await cacheInvalidate(
      "mods:*"
    );

    //////////////////////////////////////////////////
    // RESPONSE
    //////////////////////////////////////////////////

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
      query.query?.trim() || "";

    const platform =
      query.platform || undefined;

    const loader =
      query.loader || undefined;

    const type =
      query.type || undefined;

    const category =
      query.category ||
      undefined;

    const version =
      query.version ||
      undefined;

    const sort =
      query.sort || "newest";

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

    if (query.authorId) {
      where.authorId = Number(query.authorId);
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

    const cacheKey = `
mods:list:
page=${page}:
limit=${limit}:
query=${search}:
platform=${platform}:
loader=${loader}:
type=${type}:
category=${category}:
version=${version}:
sort=${sort}
`;

    const cached =
      await cacheGet(cacheKey);

    if (cached) {
      return cached;
    }

    const skip =
      (page - 1) * limit;

    const [mods, total] =
      await Promise.all([
        prisma.mod.findMany({
          where,

          skip,

          take: limit,

          orderBy,

          include: {
            images: true,

            tags: {
              include: {
                tag: true,
              },
            },

            author: {
              select: {
                id: true,
                username: true,
                avatar: true,
              },
            },
          },
        }),

        prisma.mod.count({
          where,
        }),
      ]);

    const result = {
      data: mods.map((mod) =>
        mapMod(mod)
      ),

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

        include: {
          images: true,

          versions: {
            include: {
              files: true,
            },

            orderBy: {
              createdAt: "desc",
            },
          },

          tags: {
            include: {
              tag: true,
            },
          },

          author: {
            select: {
              id: true,
              username: true,
              avatar: true,
            },
          },

          _count: {
            select: {
              comments: {
                where: {
                  deleted: false,
                },
              },
            },
          },
        },
      });

    if (!mod) {
      throw new NotFoundError(
        "Mod no encontrado"
      );
    }

    const viewKey = `
    mod:view:
    ${mod.id}:
    ${userId || reqIp}
    `;

    const alreadyViewed =
      await cacheGet(viewKey);

    if (!alreadyViewed) {
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
        60 * 30 // 30 min
      );
    }

    return mapMod(
      {
        ...mod,

        views: mod.views + 1,
      },
      userId
    );
  }

  //////////////////////////////////////////////////
  // UPDATE
  //////////////////////////////////////////////////

  static async updateMod(
    id: number,
    data: any,
    userId: number
  ) {
    const mod =
      await prisma.mod.findUnique({
        where: { id },
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
        where: { id },

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
        where: { id },
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
      where: { id },

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