import crypto from "crypto";
import path from "path";

import {
  PutObjectCommand,
} from "@aws-sdk/client-s3";

import {
  getSignedUrl,
} from "@aws-sdk/s3-request-presigner";

import { s3 } from "../../lib/s3";

import {
  BadRequestError,
} from "../../utils/errors";

import {
  IMAGE_MIME_TYPES,
  MOD_FILE_MIME_TYPES,
} from "./upload.constants";

import {
  UploadFolder,
  ImageMimeType,
  ModFileMimeType,
} from "./upload.types";

export class UploadService {

  static async createPresignedUpload(
    filename: string,
    type: string,
    folder: UploadFolder,
    userId: number
  ) {

    switch (folder) {

      case "avatars":
      case "banners":

        if (
          !IMAGE_MIME_TYPES.includes(
            type as ImageMimeType
          )
        ) {
          throw new BadRequestError(
            "Tipo de imagen no permitido"
          );
        }

        break;

      case "mods":

        if (
          !MOD_FILE_MIME_TYPES.includes(
            type as ModFileMimeType
          )
        ) {
          throw new BadRequestError(
            "Tipo de archivo no permitido"
          );
        }

        break;

      default:
        throw new BadRequestError(
          "Carpeta inválida"
        );
    }

    const ext =
      path.extname(filename);

    const key = (() => {

      switch (folder) {

        case "avatars":
          return `avatars/${userId}/avatar${ext}`;

        case "banners":
          return `banners/${userId}/banner${ext}`;

        case "mods":
          return `mods/${crypto.randomUUID()}${ext}`;

      }

    })();

    const command =
      new PutObjectCommand({
        Bucket:
          process.env.R2_BUCKET!,

        Key: key,

        ContentType: type,
      });

    const url =
      await getSignedUrl(
        s3,
        command,
        {
          expiresIn: 60 * 5,
        }
      );

    return {
      url,
      key,
    };
  }

}