import { Response } from "express";

import { InviteService } from "./invite.service";

import { asyncHandler } from "../../utils/asyncHandler";
import { AuthRequest } from "../../middleware/auth.middleware";

export const createInvite =
  asyncHandler(
    async (
      req: AuthRequest,
      res: Response
    ) => {

      const { teamId, email, role } = req.body;

      const invite =
        await InviteService.createInvite(
          teamId,
          email,
          role
        );

      res.json(invite);
    }
  );

export const acceptInvite =
  asyncHandler(
    async (
      req: AuthRequest,
      res: Response
    ) => {

      const token = String(req.params.token);

      const result =
        await InviteService.acceptInvite(
          token,
          req.userId!
        );

      res.json(result);
    }
  );

export const rejectInvite =
  asyncHandler(
    async (
      req: AuthRequest,
      res: Response
    ) => {

      const token = String(req.params.token);

      const result =
        await InviteService.rejectInvite(
          token
        );

      res.json(result);
    }
  );