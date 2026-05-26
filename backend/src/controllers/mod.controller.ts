import { Response } from "express";

import { ModService } from "../services/mod.service";

import { asyncHandler } from "../utils/asyncHandler";

import { AuthRequest } from "../middleware/auth.middleware";

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
      req: any,
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
      req: any,
      res: Response
    ) => {
      const mod =
        await ModService.getModBySlug(
          req.params.slug,
          req.userId,
          req.ip
        );

      res.json(mod);
    }
  );

export async function updateMod(
  req: any,
  res: Response
) {
  try {
    const mod =
      await ModService.updateMod(
        Number(req.params.id),
        req.body,
        req.userId
      );

    res.json(mod);
  } catch (err: any) {
    res
      .status(403)
      .json({
        error: err.message,
      });
  }
}

export async function deleteMod(
  req: any,
  res: Response
) {
  try {
    const result =
      await ModService.deleteMod(
        Number(req.params.id),
        req.userId
      );

    res.json(result);
  } catch (err: any) {
    res
      .status(403)
      .json({
        error: err.message,
      });
  }
}