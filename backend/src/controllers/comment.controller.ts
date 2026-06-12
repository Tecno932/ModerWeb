import { Response } from "express";

import { asyncHandler } from "../utils/asyncHandler";

import { AuthRequest } from "../middleware/auth.middleware";

import { CommentService } from "../services/comment.service";

export const getComments =
  asyncHandler(
    async (
      req: any,
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
        await CommentService.createComment(
          Number(req.params.modId),
          req.userId!,
          req.body.content
        );

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
        await CommentService.updateComment(
          Number(req.params.id),
          req.userId!,
          req.body.content
        );

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
        await CommentService.createReply(
          Number(req.params.id),
          req.userId!,
          req.body.content
        );

      res.status(201).json(reply);
    }
  );