import { Router } from "express";

import { authMiddleware } from "../../middleware/auth.middleware";

import {
  getInteractions,
  toggleLike,
  toggleFavorite,
} from "./interactions.controller";

const router = Router();

//////////////////////////////////////////////////////
// GET INTERACTIONS
//////////////////////////////////////////////////////

router.get(
  "/:id/interactions",
  authMiddleware,
  getInteractions
);

//////////////////////////////////////////////////////
// LIKE
//////////////////////////////////////////////////////

router.post(
  "/:id/like",
  authMiddleware,
  toggleLike
);

//////////////////////////////////////////////////////
// FAVORITE
//////////////////////////////////////////////////////

router.post(
  "/:id/favorite",
  authMiddleware,
  toggleFavorite
);

export default router;