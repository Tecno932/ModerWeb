import crypto from "crypto";
import jwt from "jsonwebtoken";

const ACCESS_SECRET =
  process.env.JWT_ACCESS_SECRET!;

const REFRESH_SECRET =
  process.env.JWT_REFRESH_SECRET!;

export function generateAccessToken(
  userId: number
) {
  return jwt.sign(
    { userId },
    ACCESS_SECRET,
    {
      expiresIn: "15m",
    }
  );
}

export function generateRefreshToken() {
  return crypto
    .randomBytes(64)
    .toString("hex");
}