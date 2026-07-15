import { Request, Response } from "express";

import { asyncHandler } from "../../utils/asyncHandler";

import { DownloadService } from "./download.service";

//////////////////////////////////////////////////
// DOWNLOAD
//////////////////////////////////////////////////

export const download =
  asyncHandler(
    async (
      req: Request,
      res: Response
    ) => {

      const url =
        await DownloadService.download(
          Number(req.params.versionId)
        );

      res.redirect(url);
    }
  );