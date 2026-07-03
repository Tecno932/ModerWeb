import { Router } from "express";

import { authMiddleware } from "../../middleware/auth.middleware";
import { optionalAuthMiddleware } from "../../middleware/optionalAuth.middleware";

import {
  getCurrentProfile,
  updateProfile,
  getPublicProfile,
} from "./users.controller";

const router = Router();

//////////////////////////////////////////////////
// CURRENT USER
//////////////////////////////////////////////////

router.get(
  "/me",
  authMiddleware,
  getCurrentProfile
);

//////////////////////////////////////////////////
// UPDATE PROFILE
//////////////////////////////////////////////////

router.patch(
  "/me",
  authMiddleware,
  updateProfile
);

//////////////////////////////////////////////////
// PUBLIC PROFILE
//////////////////////////////////////////////////

router.get(
  "/:username",
  optionalAuthMiddleware,
  getPublicProfile
);

export default router;