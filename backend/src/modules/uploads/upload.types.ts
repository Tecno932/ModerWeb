import { Loader } from "@prisma/client";

export interface PresignedUploadInput {
  filename: string;
  type: string;
  folder: "mods" | "avatars" | "banners";
}

export type UploadFolder =
  | "avatars"
  | "banners"
  | "mods";

export type ImageMimeType =
  | "image/png"
  | "image/jpeg"
  | "image/webp"
  | "image/gif";

export type ModFileMimeType =
  | "application/java-archive"
  | "application/zip"
  | "application/x-zip-compressed";