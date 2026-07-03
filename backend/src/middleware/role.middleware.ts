import {
  Response,
  NextFunction,
} from "express";

import { prisma }
  from "../lib/prisma";

import { AuthRequest }
  from "./auth.middleware";

import { SystemRole }
  from "@prisma/client";

export function roleMiddleware(
  ...roles: SystemRole[]
) {
  return async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ) => {
    if (!req.userId) {
      return res.status(401).json({
        error: "No autorizado",
      });
    }

    const user =
      await prisma.user.findUnique({
        where: {
          id: req.userId,
        },

        select: {
          role: true,
        },
      });

    if (!user) {
      return res.status(404).json({
        error: "Usuario no encontrado",
      });
    }

    if (
      !roles.includes(
        user.role
      )
    ) {
      return res.status(403).json({
        error: "Permisos insuficientes",
      });
    }

    next();
  };
}