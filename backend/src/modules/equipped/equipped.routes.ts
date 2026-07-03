import { Router }
  from "express";

import {
  authMiddleware,
} from "../../middleware/auth.middleware";

import {
  getMyEquipped,
  getUserEquipped,
  equip,
  unequip,
} from "./equipped.controller";

const router = Router();

router.get(
  "/me",
  authMiddleware,
  getMyEquipped
);

router.post(
  "/equip",
  authMiddleware,
  equip
);

router.delete(
  "/unequip/:type",
  authMiddleware,
  unequip
);

router.get(
  "/:username",
  getUserEquipped
);

export default router;