import { Response } from "express";
import { SocialPlatform } from "@prisma/client";

import { asyncHandler } from "../../utils/asyncHandler";
import { AuthRequest } from "../../middleware/auth.middleware";
import { SocialsService } from "./socials.service";

//////////////////////////////////////////////////
// GET MY SOCIALS
//////////////////////////////////////////////////

export const getMySocials =
  asyncHandler(
    async (
      req: AuthRequest,
      res: Response
    ) => {
      const socials =
        await SocialsService.getMySocials(
          req.userId!
        );

      res.json(socials);
    }
  );

//////////////////////////////////////////////////
// GET USER SOCIALS
//////////////////////////////////////////////////

export const getUserSocials =
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

      const socials =
        await SocialsService.getUserSocials(
          username
        );

      res.json(socials);
    }
  );

//////////////////////////////////////////////////
// UPSERT SOCIAL
//////////////////////////////////////////////////

export const upsertSocial =
  asyncHandler(
    async (
      req: AuthRequest,
      res: Response
    ) => {
      const social =
        await SocialsService.upsertSocial(
          req.userId!,
          req.body
        );

      res.json(social);
    }
  );

//////////////////////////////////////////////////
// DELETE SOCIAL
//////////////////////////////////////////////////

export const deleteSocial =
  asyncHandler(
    async (
      req: AuthRequest,
      res: Response
    ) => {
      const platform =
        req.params
          .platform as SocialPlatform;

      const result =
        await SocialsService.deleteSocial(
          req.userId!,
          platform
        );

      res.json(result);
    }
  );