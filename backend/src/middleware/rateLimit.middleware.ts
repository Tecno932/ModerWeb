import {
  Request,
  Response,
  NextFunction,
} from "express";

import { getRedis } from "../lib/redis";

export function rateLimit(options: {
  window: number;
  limit: number;
}) {
  return async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {

    const redis = getRedis();

    // ✅ si redis no existe → no limitar
    if (!redis) {
      return next();
    }

    const ip = req.ip || "unknown";

    const key = `rate:${ip}`;

    try {
      const current = await redis.incr(key);

      if (current === 1) {
        await redis.expire(
          key,
          options.window
        );
      }

      if (current > options.limit) {
        return res.status(429).json({
          error: "Too many requests",
        });
      }

      next();

    } catch {
      // ✅ fallback si redis falla
      next();
    }
  };
}