import { Response } from "express";

import { asyncHandler } from "../../utils/asyncHandler";
import { AuthRequest } from "../../middleware/auth.middleware";

import { InteractionsService } from "./interactions.service";

export const getInteractions =
  asyncHandler(
    async (
      req: AuthRequest,
      res: Response
    ) => {

      const data =
        await InteractionsService.getInteractions(
          Number(req.params.id),
          req.userId!
        );

      res.json(data);
    }
  );

export const toggleLike =
  asyncHandler(
    async (
      req: AuthRequest,
      res: Response
    ) => {

      const data =
        await InteractionsService.toggleLike({
          modId: Number(req.params.id),
          userId: req.userId!,
        });

      res.json(data);
    }
  );

export const toggleFavorite =
  asyncHandler(
    async (
      req: AuthRequest,
      res: Response
    ) => {

      const data =
        await InteractionsService.toggleFavorite({
          modId: Number(req.params.id),
          userId: req.userId!,
        });

      res.json(data);
    }
  );