import { Router } from "express";

import {
  getMySocials,
  getUserSocials,
  upsertSocial,
  deleteSocial,
} from "./socials.controller";

import {
  authMiddleware,
} from "../../middleware/auth.middleware";

const router = Router();

//////////////////////////////////////////////////
// CURRENT USER
//////////////////////////////////////////////////

router.get(
  "/me",
  authMiddleware,
  getMySocials
);

router.put(
  "/me",
  authMiddleware,
  upsertSocial
);

router.delete(
  "/me/:platform",
  authMiddleware,
  deleteSocial
);

//////////////////////////////////////////////////
// PUBLIC
//////////////////////////////////////////////////

router.get(
  "/:username",
  getUserSocials
);

export default router;