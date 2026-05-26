import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/errors";

export function errorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.error("🔥 ERROR:", err);

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      error: err.name,
      message: err.message,
      status: err.statusCode,
    });
  }

  // errores de Zod
  if (err.name === "ZodError") {
    return res.status(400).json({
      error: "ValidationError",
      message: err.errors.map((e: any) => e.message),
      status: 400,
    });
  }

  // fallback
  return res.status(500).json({
    error: "InternalServerError",
    message: "Algo salió mal",
    status: 500,
  });
}