import { Request, Response } from "express";

import {
  CreateMultipartUploadCommand,
  UploadPartCommand,
  CompleteMultipartUploadCommand,
} from "@aws-sdk/client-s3";

import { getSignedUrl }
  from "@aws-sdk/s3-request-presigner";

import { s3 }
  from "../../lib/s3";

////////////////////////////////////////////////////////
// START MULTIPART
////////////////////////////////////////////////////////

export async function startMultipartUpload(
  req: Request,
  res: Response
) {
  try {
    const { filename, type } =
      req.body;

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

    return res.json({
      uploadId:
        response.UploadId,

      key,
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      error:
        "Error starting multipart upload",
    });
  }
}

////////////////////////////////////////////////////////
// GET PART URL
////////////////////////////////////////////////////////

export async function getMultipartPartUrl(
  req: Request,
  res: Response
) {
  try {
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

    return res.json({
      url,
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      error:
        "Error generating part url",
    });
  }
}

////////////////////////////////////////////////////////
// COMPLETE MULTIPART
////////////////////////////////////////////////////////

export async function completeMultipartUpload(
  req: Request,
  res: Response
) {
  try {
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

    return res.json({
      success: true,

      location:
        response.Location,
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      error:
        "Error completing multipart upload",
    });
  }
}