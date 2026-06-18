import { Request, Response } from "express";
import { AuthRequest } from "../../middleware/auth.middleware";

import {
  loginUser,
  registerUser,
  getCurrentUser
} from "./auth.service";

//////////////////////////////////////////////////
// REGISTER
//////////////////////////////////////////////////

export async function register(
  req: Request,
  res: Response
) {
  try {
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
  } catch (error: unknown) {
    const message =
      error instanceof Error
        ? error.message
        : "Error desconocido";

    res.status(400).json({
      error: message,
    });
  }
}

//////////////////////////////////////////////////
// LOGIN
//////////////////////////////////////////////////

export async function login(
  req: Request,
  res: Response
) {
  try {
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
  } catch (error: unknown) {
    const message =
      error instanceof Error
        ? error.message
        : "Error desconocido";

    res.status(400).json({
      error: message,
    });
  }
}

//////////////////////////////////////////////////
// ME
//////////////////////////////////////////////////

export async function me(
  req: AuthRequest,
  res: Response
) {
  try {
    const userId = req.userId;

    if (!userId) {
      return res
        .status(401)
        .json({
          error: "No autorizado",
        });
    }

    const user =
      await getCurrentUser(
        userId
      );

    res.json(user);
  } catch (error: unknown) {
    const message =
      error instanceof Error
        ? error.message
        : "Error desconocido";

    res.status(400).json({
      error: message,
    });
  }
}