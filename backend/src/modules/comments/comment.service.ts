import { prisma } from "../../lib/prisma";

import {
  BadRequestError,
  ForbiddenError,
  NotFoundError,
} from "../../utils/errors";

import { sanitizeText } from "../../utils/sanitize";

import {
  CreateCommentInput,
  CreateReplyInput,
  UpdateCommentInput,
} from "./comment.types";

import { commentUserSelect } from "./comment.select";
import { mapCommentUser } from "./comment.mapper";

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
            select: commentUserSelect,
          },

          replies: {
            where: {
              deleted: false,
            },

            include: {
              user: {
                select:
                  commentUserSelect,
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

    return comments.map((comment) => ({
      ...mapCommentUser(comment),

      replies:
        comment.replies.map(
          mapCommentUser
        ),
    }));
  }

  //////////////////////////////////////////////////
  // CREATE COMMENT
  //////////////////////////////////////////////////

  static async createComment({
    modId,
    userId,
    content,
  }: CreateCommentInput) {
    const safeContent =
      sanitizeText(
        content?.trim() || ""
      );

    if (!safeContent) {
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
          content: safeContent,
        },

        include: {
          user: {
            select:
              commentUserSelect,
          },
        },
      });

    return mapCommentUser(
      comment
    );
  }

  //////////////////////////////////////////////////
  // UPDATE COMMENT
  //////////////////////////////////////////////////

  static async updateComment({
    commentId,
    userId,
    content,
  }: UpdateCommentInput) {
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

    const safeContent =
      sanitizeText(
        content?.trim() || ""
      );

    if (!safeContent) {
      throw new BadRequestError(
        "Comentario vacío"
      );
    }

    return prisma.comment.update({
      where: {
        id: commentId,
      },

      data: {
        content: safeContent,
      },
    });
  }

  //////////////////////////////////////////////////
  // DELETE COMMENT
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

  static async createReply({
    parentId,
    userId,
    content,
  }: CreateReplyInput) {
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

    const safeContent =
      sanitizeText(
        content?.trim() || ""
      );

    if (!safeContent) {
      throw new BadRequestError(
        "Comentario vacío"
      );
    }

    const reply =
      await prisma.comment.create({
        data: {
          modId: parent.modId,
          userId,
          parentId,
          content: safeContent,
        },

        include: {
          user: {
            select:
              commentUserSelect,
          },
        },
      });

    return mapCommentUser(
      reply
    );
  }
}