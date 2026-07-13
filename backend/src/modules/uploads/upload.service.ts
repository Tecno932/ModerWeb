import crypto from "crypto";
import path from "path";

import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { UploadFolder } from "./upload.types";

import { s3 } from "../../lib/s3";

import {
  IMAGE_MIME_TYPES,
  MOD_FILE_MIME_TYPES,
} from "./upload.constants";

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
          !IMAGE_MIME_TYPES.includes(type as any)
        ) {
          throw new Error(
            "Tipo de imagen no permitido"
          );
        }

        break;

      case "mods":

        if (
          !MOD_FILE_MIME_TYPES.includes(type as any)
        ) {
          throw new Error(
            "Tipo de archivo no permitido"
          );
        }

        break;

      default:
        throw new Error(
          "Carpeta inválida"
        );
    }

    const ext = path.extname(filename);

    let key: string;

    switch (folder) {

      case "avatars":
        key =
          `avatars/${userId}/avatar${ext}`;
        break;

      case "banners":
        key =
          `banners/${userId}/banner${ext}`;
        break;

      case "mods":
        key =
          `mods/${crypto.randomUUID()}${ext}`;
        break;

      default:
        throw new Error(
          "Carpeta inválida"
        );
    }

    const command =
      new PutObjectCommand({
        Bucket: process.env.R2_BUCKET!,
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