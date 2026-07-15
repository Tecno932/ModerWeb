import { ReleaseType } from "@prisma/client";

export interface UploadFileInput {
  filename: string;
  originalname: string;
  mimetype: string;
  size: number;
}

export interface CreateFileInput {
  versionId: number;
  userId: number;
  file: UploadFileInput;
}

export { ReleaseType };