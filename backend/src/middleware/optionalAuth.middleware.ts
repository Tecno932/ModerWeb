import {
  Response,
  NextFunction,
} from "express";

import jwt from "jsonwebtoken";

import { AuthRequest }
  from "./auth.middleware";

export function optionalAuthMiddleware(
  req: AuthRequest,
  _res: Response,
  next: NextFunction
) {
  const authHeader =
    req.headers.authorization;

  if (
    !authHeader ||
    !authHeader.startsWith(
      "Bearer "
    )
  ) {
    return next();
  }

  try {
    const token =
      authHeader.split(" ")[1];

    const decoded =
      jwt.verify(
        token,
        process.env.JWT_ACCESS_SECRET!
      ) as {
        userId: number;
      };

    req.userId =
      decoded.userId;
  } catch {
    // ignorar token inválido
  }

  next();
}