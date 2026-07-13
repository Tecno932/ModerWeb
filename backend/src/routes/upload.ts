import { Router } from "express";

import { authMiddleware }
  from "../middleware/auth.middleware";

import { getPresignedUrl, } from "../modules/uploads/upload.controller";

import {
  startMultipartUpload,
  getMultipartPartUrl,
  completeMultipartUpload,
} from "../modules/uploads/multipart.controller";

const router = Router();

router.post(
  "/presigned",
  authMiddleware,
  getPresignedUrl
);

router.post(
  "/start",
  authMiddleware,
  startMultipartUpload
);

router.post(
  "/part-url",
  authMiddleware,
  getMultipartPartUrl
);

router.post(
  "/complete",
  authMiddleware,
  completeMultipartUpload
);

export default router;