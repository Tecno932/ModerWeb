import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { AuthRequest } from "../../middleware/auth.middleware";
import { CommentService } from "./comment.service";

export const getComments =
  asyncHandler(
    async (
      req: Request,
      res: Response
    ) => {

      const comments =
        await CommentService.getComments(
          Number(req.params.modId)
        );

      res.json(comments);
    }
  );

export const createComment =
  asyncHandler(
    async (
      req: AuthRequest,
      res: Response
    ) => {
      const comment =
        await CommentService.createComment({
          modId: Number(req.params.modId),
          userId: req.userId!,
          content: req.body.content,
        });

      res
        .status(201)
        .json(comment);
    }
  );

export const updateComment =
  asyncHandler(
    async (
      req: AuthRequest,
      res: Response
    ) => {
      const comment =
        await CommentService.updateComment({
          commentId: Number(req.params.commentId),
          userId: req.userId!,
          content: req.body.content,
        });

      res.json(comment);
    }
  );

export const deleteComment =
  asyncHandler(
    async (
      req: AuthRequest,
      res: Response
    ) => {
      const result =
        await CommentService.deleteComment(
          Number(req.params.id),
          req.userId!
        );

      res.json(result);
    }
  );

export const createReply =
  asyncHandler(
    async (
      req: AuthRequest,
      res: Response
    ) => {
      const reply =
        await CommentService.createReply({
          parentId: Number(req.params.commentId),
          userId: req.userId!,
          content: req.body.content,
        });

      res.status(201).json(reply);
    }
  );