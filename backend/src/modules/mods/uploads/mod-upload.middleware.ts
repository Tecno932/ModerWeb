import { modUpload } from "./mod-upload.config";

export const createModUploadMiddleware =
  modUpload.fields([
    {
      name: "icon",
      maxCount: 1,
    },

    {
      name: "gallery",
      maxCount: 10,
    },
  ]);