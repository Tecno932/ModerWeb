import { Request, Response, NextFunction } from "express";

export function antiAbuse(req: Request, res: Response, next: NextFunction) {
  const ua = req.headers["user-agent"] || "";

  // bloquea bots básicos
  if (!ua || ua.length < 10) {
    return res.status(403).json({ error: "Blocked" });
  }

  // tamaño payload
  if (JSON.stringify(req.body).length > 50_000) {
    return res.status(413).json({ error: "Payload too large" });
  }

  next();
}