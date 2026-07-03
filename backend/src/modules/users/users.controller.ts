import { Response } from "express";

import { asyncHandler } from "../../utils/asyncHandler";
import { AuthRequest } from "../../middleware/auth.middleware";
import { UsersService } from "./users.service";

//////////////////////////////////////////////////
// GET CURRENT PROFILE
//////////////////////////////////////////////////

export const getCurrentProfile =
  asyncHandler(
    async (
      req: AuthRequest,
      res: Response
    ) => {
      const profile =
        await UsersService.getCurrentProfile(
          req.userId!
        );

      res.json(profile);
    }
  );

//////////////////////////////////////////////////
// UPDATE PROFILE
//////////////////////////////////////////////////

export const updateProfile =
  asyncHandler(
    async (
      req: AuthRequest,
      res: Response
    ) => {
      const profile =
        await UsersService.updateProfile(
          req.userId!,
          req.body
        );

      res.json(profile);
    }
  );

//////////////////////////////////////////////////
// GET PUBLIC PROFILE
//////////////////////////////////////////////////

export const getPublicProfile =
  asyncHandler(
    async (
      req: AuthRequest,
      res: Response
    ) => {
      const username =
        req.params.username;

      if (
        !username ||
        Array.isArray(username)
      ) {
        return res.status(400).json({
          error: "Username inválido",
        });
      }

      const profile =
        await UsersService.getPublicProfile(
          username,
          req.userId
        );

      res.json(profile);
    }
  );