import { Response } from "express";

import { UploadService }
  from "./upload.service";

export async function getPresignedUrl(
  req: any,
  res: Response
) {
  const {
    filename,
    type,
    folder,
  } = req.body;

  if (!filename || !type) {
    return res.status(400).json({
      error: "Missing data",
    });
  }

  const result =
    await UploadService.createPresignedUpload(
      filename,
      type,
      folder,
      req.userId
    );

  res.json(result);
}