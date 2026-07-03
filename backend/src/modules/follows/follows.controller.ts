import { Response } from "express";

import { asyncHandler } from "../../utils/asyncHandler";
import { AuthRequest } from "../../middleware/auth.middleware";

import { FollowsService } from "./follows.service";

interface UsernameParams {
  username: string;
}

//////////////////////////////////////////////////
// FOLLOW
//////////////////////////////////////////////////

export const followUser =
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

      const result =
        await FollowsService.followUser(
          req.userId!,
          username
        );

      res.json(result);
    }
  );

//////////////////////////////////////////////////
// UNFOLLOW
//////////////////////////////////////////////////

export const unfollowUser =
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

      const result =
        await FollowsService.unfollowUser(
          req.userId!,
          username
        );

      res.json(result);
    }
  );

//////////////////////////////////////////////////
// FOLLOWERS
//////////////////////////////////////////////////

export const getFollowers =
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

      const result =
        await FollowsService.getFollowers(
          username
        );

      res.json(result);
    }
  );

//////////////////////////////////////////////////
// FOLLOWING
//////////////////////////////////////////////////

export const getFollowing =
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

      const result =
        await FollowsService.getFollowing(
          username
        );

      res.json(result);
    }
  );