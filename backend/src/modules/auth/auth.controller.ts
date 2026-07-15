import { Request, Response } from "express";

import { AuthRequest } from "../../middleware/auth.middleware";
import { asyncHandler } from "../../utils/asyncHandler";

import {
  loginUser,
  registerUser,
  getCurrentUser,
  refreshAccessToken,
  logoutUser,
  logoutAllSessions,
} from "./auth.service";

//////////////////////////////////////////////////
// REGISTER
//////////////////////////////////////////////////

export const register =
  asyncHandler(
    async (
      req: Request,
      res: Response
    ) => {

      const {
        username,
        email,
        password,
      } = req.body;

      const user =
        await registerUser({
          username,
          email,
          password,
        });

      res
        .status(201)
        .json(user);
    }
  );

//////////////////////////////////////////////////
// LOGIN
//////////////////////////////////////////////////

export const login =
  asyncHandler(
    async (
      req: Request,
      res: Response
    ) => {

      const {
        email,
        password,
      } = req.body;

      const result =
        await loginUser({
          email,
          password,
        });

      res.json(result);
    }
  );

//////////////////////////////////////////////////
// ME
//////////////////////////////////////////////////

export const me =
  asyncHandler(
    async (
      req: AuthRequest,
      res: Response
    ) => {

      const user =
        await getCurrentUser(
          req.userId!
        );

      res.json(user);
    }
  );

//////////////////////////////////////////////////
// REFRESH
//////////////////////////////////////////////////

export const refresh =
  asyncHandler(
    async (
      req: Request,
      res: Response
    ) => {

      const {
        refreshToken,
      } = req.body;

      const result =
        await refreshAccessToken(
          refreshToken
        );

      res.json(result);
    }
  );

//////////////////////////////////////////////////
// LOGOUT
//////////////////////////////////////////////////

export const logout =
  asyncHandler(
    async (
      req: Request,
      res: Response
    ) => {

      const {
        refreshToken,
      } = req.body;

      const result =
        await logoutUser(
          refreshToken
        );

      res.json(result);
    }
  );

//////////////////////////////////////////////////
// LOGOUT ALL
//////////////////////////////////////////////////

export const logoutAll =
  asyncHandler(
    async (
      req: AuthRequest,
      res: Response
    ) => {

      const result =
        await logoutAllSessions(
          req.userId!
        );

      res.json(result);
    }
  );