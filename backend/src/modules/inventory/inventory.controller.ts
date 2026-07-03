import {
  Request,
  Response,
} from "express";

import { asyncHandler }
  from "../../utils/asyncHandler";

import { AuthRequest }
  from "../../middleware/auth.middleware";

import { InventoryService }
  from "./inventory.service";

//////////////////////////////////////////////////
// MY INVENTORY
//////////////////////////////////////////////////

export const getMyInventory =
  asyncHandler(
    async (
      req: AuthRequest,
      res: Response
    ) => {
      const inventory =
        await InventoryService.getMyInventory(
          req.userId!
        );

      res.json(inventory);
    }
  );

//////////////////////////////////////////////////
// USER INVENTORY
//////////////////////////////////////////////////

export const getUserInventory =
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

      const inventory =
        await InventoryService.getUserInventory(
          username
        );

      res.json(inventory);
    }
  );

//////////////////////////////////////////////////
// GRANT
//////////////////////////////////////////////////

export const grantItem =
  asyncHandler(
    async (
      req: Request,
      res: Response
    ) => {
      const result =
        await InventoryService.grantItem(
          req.body
        );

      res.status(201).json(
        result
      );
    }
  );

//////////////////////////////////////////////////
// REMOVE
//////////////////////////////////////////////////

export const removeItem =
  asyncHandler(
    async (
      req: Request,
      res: Response
    ) => {
      const result =
        await InventoryService.removeItem(
          req.body
        );

      res.json(result);
    }
  );

//////////////////////////////////////////////////
// CHECK OWNERSHIP
//////////////////////////////////////////////////

export const checkOwnership =
  asyncHandler(
    async (
      req: AuthRequest,
      res: Response
    ) => {
      const result =
        await InventoryService.checkOwnership(
          req.userId!,
          Number(
            req.params.itemId
          )
        );

      res.json(result);
    }
  );