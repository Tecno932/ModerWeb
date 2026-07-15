import { Request, Response } from "express";

import { ModService } from "./mod.service";
import { asyncHandler } from "../../utils/asyncHandler";
import { AuthRequest } from "../../middleware/auth.middleware";

export const createMod =
  asyncHandler(
    async (
      req: AuthRequest,
      res: Response
    ) => {
      const mod =
        await ModService.createMod(
          req.body,
          req.files,
          req.userId!
        );

      res
        .status(201)
        .json(mod);
    }
  );

export const getMods =
  asyncHandler(
    async (
      req: Request,
      res: Response
    ) => {
      const mods =
        await ModService.getMods(
          req.query
        );

      res.json(mods);
    }
  );

export const getModBySlug =
  asyncHandler(
    async (
      req: AuthRequest,
      res: Response
    ) => {

      const slug = String(req.params.slug);

      const mod =
        await ModService.getModBySlug(
          slug,
          req.userId,
          req.ip
        );

      res.json(mod);
    }
  );

export const updateMod =
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

export const deleteMod =
  asyncHandler(
    async (
      req: AuthRequest,
      res: Response
    ) => {

      const result =
        await ModService.deleteMod(
          Number(req.params.id),
          req.userId!
        );

      res.json(result);
    }
  );