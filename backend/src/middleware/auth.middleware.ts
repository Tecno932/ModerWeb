import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthRequest extends Request {
  userId?: number;
}

export function authMiddleware(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization;

  console.log("🔐 Authorization header:", authHeader);

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    console.log("❌ Token requerido o mal formato");
    return res.status(401).json({ error: "Token requerido" });
  }

  const token = authHeader.split(" ")[1];

  console.log("🔑 Token extraído:", token);

  try {
    if (!process.env.JWT_SECRET) {
      console.log("❌ JWT_SECRET no configurado");
      throw new Error("JWT_SECRET no configurado");
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    ) as { userId: number };

    console.log("✅ Token decodificado:", decoded);

    if (!decoded.userId) {
      console.log("❌ userId no presente en token");
      return res.status(401).json({ error: "Token inválido" });
    }

    req.userId = decoded.userId;

    next();
  } catch (err: any) {
    console.log("❌ Error verificando token:", err.message);

    return res.status(401).json({
      error: "Token inválido",
      detail: err.message,
    });
  }
}