import { Response } from "express";

import { asyncHandler } from "../../utils/asyncHandler";

import { AuthRequest } from "../../middleware/auth.middleware";

import { ModService } from "../mod/mod.service";

export const getProject =
  asyncHandler(
    async (
      req: AuthRequest,
      res: Response
    ) => {

      const mod =
        await ModService.getProjectById(
          Number(req.params.id),
          req.userId
        );

      res.json(mod);
    }
  );

export const updateProject =
  asyncHandler(
    async (
      req: AuthRequest,
      res: Response
    ) => {

      const mod =
        await ModService.updateMod(
          Number(req.params.id),
          req.body,
          req.userId!
        );

      res.json(mod);
    }
  );