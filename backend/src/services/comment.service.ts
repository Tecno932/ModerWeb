import { prisma } from "../lib/prisma";

import {
  BadRequestError,
  NotFoundError,
  ForbiddenError,
} from "../utils/errors";

import { sanitizeText } from "../utils/sanitize";

export class CommentService {
  //////////////////////////////////////////////////
  // GET COMMENTS
  //////////////////////////////////////////////////

  static async getComments(
    modId: number
  ) {
    const comments =
      await prisma.comment.findMany({
        where: {
          modId,
          deleted: false,
          parentId: null,
        },

        include: {
          user: {
            select: {
              id: true,
              username: true,
              avatar: true,
            },
          },

          replies: {
            where: {
              deleted: false,
            },

            include: {
              user: {
                select: {
                  id: true,
                  username: true,
                  avatar: true,
                },
              },
            },

            orderBy: {
              createdAt: "asc",
            },
          },
        },

        orderBy: {
          createdAt: "desc",
        },
      });

    return comments;
  }

  //////////////////////////////////////////////////
  // CREATE COMMENT
  //////////////////////////////////////////////////

  static async createComment(
    modId: number,
    userId: number,
    content: string
  ) {
    if (!content?.trim()) {
      throw new BadRequestError(
        "Comentario vacío"
      );
    }

    const mod =
      await prisma.mod.findUnique({
        where: {
          id: modId,
        },
      });

    if (!mod) {
      throw new NotFoundError(
        "Mod no encontrado"
      );
    }

    const comment =
      await prisma.comment.create({
        data: {
          modId,
          userId,

          content:
            sanitizeText(
              content.trim()
            ),
        },

        include: {
          user: {
            select: {
              id: true,
              username: true,
              avatar: true,
            },
          },
        },
      });

    return comment;
  }

  //////////////////////////////////////////////////
  // EDIT COMMNET
  //////////////////////////////////////////////////

  static async updateComment(
    commentId: number,
    userId: number,
    content: string
  ) {
    const comment =
      await prisma.comment.findUnique({
        where: {
          id: commentId,
        },
      });

    if (
      !comment ||
      comment.deleted
    ) {
      throw new NotFoundError(
        "Comentario no encontrado"
      );
    }

    if (
      comment.userId !== userId
    ) {
      throw new ForbiddenError(
        "No autorizado"
      );
    }

    if (!content?.trim()) {
      throw new BadRequestError(
        "Comentario vacío"
      );
    }

    return prisma.comment.update({
      where: {
        id: commentId,
      },

      data: {
        content:
          sanitizeText(
            content.trim()
          ),
      },
    });
  }

  //////////////////////////////////////////////////
  // DELATE COMMENT
  //////////////////////////////////////////////////

  static async deleteComment(
    commentId: number,
    userId: number
  ) {
    const comment =
      await prisma.comment.findUnique({
        where: {
          id: commentId,
        },
      });

    if (
      !comment ||
      comment.deleted
    ) {
      throw new NotFoundError(
        "Comentario no encontrado"
      );
    }

    if (
      comment.userId !== userId
    ) {
      throw new ForbiddenError(
        "No autorizado"
      );
    }

    await prisma.comment.update({
      where: {
        id: commentId,
      },

      data: {
        deleted: true,
      },
    });

    return {
      success: true,
    };
  }

    //////////////////////////////////////////////////
    // CREATE REPLY
    //////////////////////////////////////////////////

  static async createReply(
    parentId: number,
    userId: number,
    content: string
  ) {
    const parent =
      await prisma.comment.findUnique({
        where: {
          id: parentId,
        },
      });

    if (!parent) {
      throw new NotFoundError(
        "Comentario no encontrado"
      );
    }

    if (
      parent.parentId !== null
    ) {
      throw new BadRequestError(
        "Solo un nivel de respuestas permitido"
      );
    }

    if (!content?.trim()) {
      throw new BadRequestError(
        "Comentario vacío"
      );
    }

    return prisma.comment.create({
      data: {
        modId: parent.modId,

        userId,

        parentId,

        content:
          sanitizeText(
            content.trim()
          ),
      },

      include: {
        user: {
          select: {
            id: true,
            username: true,
            avatar: true,
          },
        },
      },
    });
  }
}