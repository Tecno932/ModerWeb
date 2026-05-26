import { Router } from "express";

import { authMiddleware } from "../../middleware/auth.middleware";

import { InteractionsController } from "./interactions.controller";

const router = Router();

//////////////////////////////////////////////////////
// GET INTERACTIONS
//////////////////////////////////////////////////////

router.get(
  "/:id/interactions",
  authMiddleware,
  InteractionsController.getInteractions
);

//////////////////////////////////////////////////////
// LIKE
//////////////////////////////////////////////////////

router.post(
  "/:id/like",
  authMiddleware,
  InteractionsController.toggleLike
);

//////////////////////////////////////////////////////
// FAVORITE
//////////////////////////////////////////////////////

router.post(
  "/:id/favorite",
  authMiddleware,
  InteractionsController.toggleFavorite
);

export default router;