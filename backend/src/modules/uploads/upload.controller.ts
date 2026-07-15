import { Response } from "express";
import { AuthRequest } from "../../middleware/auth.middleware";
import { asyncHandler } from "../../utils/asyncHandler";

import { UploadService }
  from "./upload.service";

export const getPresignedUrl = asyncHandler(
  async (
    req: AuthRequest,
    res: Response
  ) => {
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
      req.userId!
    );

  res.json(result);
  }
);