import { Router } from "express";

import { authMiddleware } from "../../middleware/auth.middleware";

import { upload } from "../../lib/multer";

import {
  createMod,
  getMods,
  getModBySlug,
  updateMod,
  deleteMod,
} from "./mod.controller";

const router = Router();

//////////////////////////////////////////////////
// CREATE
//////////////////////////////////////////////////

router.post(
  "/",
  authMiddleware,

  upload.fields([
    {
      name: "icon",
      maxCount: 1,
    },

    {
      name: "gallery",
      maxCount: 10,
    },
  ]),

  createMod
);

//////////////////////////////////////////////////
// GET ALL
//////////////////////////////////////////////////

router.get("/", getMods);

//////////////////////////////////////////////////
// GET ONE
//////////////////////////////////////////////////

router.get(
  "/:slug",
  authMiddleware,
  getModBySlug
);

//////////////////////////////////////////////////
// UPDATE
//////////////////////////////////////////////////

router.patch(
  "/:id",
  authMiddleware,
  updateMod
);

//////////////////////////////////////////////////
// DELETE
//////////////////////////////////////////////////

router.delete(
  "/:id",
  authMiddleware,
  deleteMod
);

export default router;