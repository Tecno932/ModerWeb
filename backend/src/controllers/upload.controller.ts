import { Request, Response } from "express";
import { s3 } from "../lib/s3";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import crypto from "crypto";
import path from "path";

export async function getPresignedUrl(req: any, res: Response) {
  const { filename, type } = req.body;

  if (!filename || !type) {
    return res.status(400).json({ error: "Missing data" });
  }

  const allowedTypes = [
    "application/java-archive",
    "application/zip",
  ];

  if (!allowedTypes.includes(type)) {
    return res.status(400).json({ error: "Tipo no permitido" });
  }

  const ext = path.extname(filename);
  const key = `mods/${crypto.randomUUID()}${ext}`;

  const command = new PutObjectCommand({
    Bucket: process.env.R2_BUCKET!,
    Key: key,
    ContentType: type,
  });

  const url = await getSignedUrl(s3, command, {
    expiresIn: 60 * 5,
  });

  res.json({ url, key });
}