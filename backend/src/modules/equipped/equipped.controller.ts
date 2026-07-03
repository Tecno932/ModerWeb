import {
  Request,
  Response,
} from "express";

import {
  CosmeticType,
} from "@prisma/client";

import { asyncHandler }
  from "../../utils/asyncHandler";

import { AuthRequest }
  from "../../middleware/auth.middleware";

import { EquippedService }
  from "./equipped.service";

export const getMyEquipped =
  asyncHandler(
    async (
      req: AuthRequest,
      res: Response
    ) => {
      const result =
        await EquippedService.getMyEquipped(
          req.userId!
        );

      res.json(result);
    }
  );

export const getUserEquipped =
  asyncHandler(
    async (
      req: Request,
      res: Response
    ) => {
      const username =
        req.params.username;

      if (
        !username ||
        Array.isArray(username)
      ) {
        return res.status(400).json({
          error:
            "Username inválido",
        });
      }

      const result =
        await EquippedService.getUserEquipped(
          username
        );

      res.json(result);
    }
  );

export const equip =
  asyncHandler(
    async (
      req: AuthRequest,
      res: Response
    ) => {
      const result =
        await EquippedService.equip(
          req.userId!,
          req.body.cosmeticId
        );

      res.json(result);
    }
  );

export const unequip =
  asyncHandler(
    async (
      req: AuthRequest,
      res: Response
    ) => {
      const type =
        req.params.type as CosmeticType;

      const result =
        await EquippedService.unequip(
          req.userId!,
          type
        );

      res.json(result);
    }
  );