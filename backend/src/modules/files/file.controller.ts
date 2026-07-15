import { FileService } from "./file.service";
import { Response } from "express";

import { AuthRequest } from "../../middleware/auth.middleware";
import { asyncHandler } from "../../utils/asyncHandler";

export const uploadFile =
  asyncHandler(
    async (
      req: AuthRequest,
      res: Response
    ) => {

      const result =
        await FileService.uploadFile({
          file: req.file!,
          versionId: Number(req.params.id),
          userId: req.userId!,
        });

      res.json(result);
    }
  );