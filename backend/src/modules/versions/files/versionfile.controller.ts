import { Response } from "express";

import { AuthRequest } from "../../../middleware/auth.middleware";
import { asyncHandler } from "../../../utils/asyncHandler";

import * as VersionFileService from "./versionfiles.service";

export const getFiles =
  asyncHandler(
    async (
      req: AuthRequest,
      res: Response
    ) => {

      const files =
        await VersionFileService.getFiles(
          Number(req.params.id)
        );

      res.json(files);

    }
  );

export const deleteFile =
  asyncHandler(
    async (
      req: AuthRequest,
      res: Response
    ) => {

      const result =
        await VersionFileService.deleteFile(
          Number(req.params.fileId),
          req.userId!
        );

      res.json(result);

    }
  );