import { Request, Response } from "express";

import {
  CompleteMultipartUploadCommand,
  CreateMultipartUploadCommand,
  UploadPartCommand,
} from "@aws-sdk/client-s3";

import { getSignedUrl }
  from "@aws-sdk/s3-request-presigner";

import { asyncHandler }
  from "../../utils/asyncHandler";

import { s3 }
  from "../../lib/s3";

////////////////////////////////////////////////////////
// START MULTIPART
////////////////////////////////////////////////////////

export const startMultipartUpload =
  asyncHandler(
    async (
      req: Request,
      res: Response
    ) => {

      const {
        filename,
        type,
      } = req.body;

      const key =
        `mods/${Date.now()}-${filename}`;

      const command =
        new CreateMultipartUploadCommand({
          Bucket:
            process.env.R2_BUCKET!,

          Key: key,

          ContentType: type,
        });

      const response =
        await s3.send(command);

      res.json({
        uploadId:
          response.UploadId,

        key,
      });
    }
  );

////////////////////////////////////////////////////////
// GET PART URL
////////////////////////////////////////////////////////

export const getMultipartPartUrl =
  asyncHandler(
    async (
      req: Request,
      res: Response
    ) => {

      const {
        uploadId,
        key,
        partNumber,
      } = req.body;

      const command =
        new UploadPartCommand({
          Bucket:
            process.env.R2_BUCKET!,

          Key: key,

          UploadId: uploadId,

          PartNumber: partNumber,
        });

      const url =
        await getSignedUrl(
          s3,
          command,
          {
            expiresIn: 3600,
          }
        );

      res.json({
        url,
      });
    }
  );

////////////////////////////////////////////////////////
// COMPLETE MULTIPART
////////////////////////////////////////////////////////

export const completeMultipartUpload =
  asyncHandler(
    async (
      req: Request,
      res: Response
    ) => {

      const {
        uploadId,
        key,
        parts,
      } = req.body;

      const command =
        new CompleteMultipartUploadCommand({
          Bucket:
            process.env.R2_BUCKET!,

          Key: key,

          UploadId: uploadId,

          MultipartUpload: {
            Parts: parts,
          },
        });

      const response =
        await s3.send(command);

      res.json({
        success: true,

        location:
          response.Location,
      });
    }
  );