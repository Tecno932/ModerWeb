import { Router }
  from "express";

import {
  SystemRole,
} from "@prisma/client";

import {
  authMiddleware,
} from "../../middleware/auth.middleware";

import {
  roleMiddleware,
} from "../../middleware/role.middleware";

import {
  getMyInventory,
  getUserInventory,
  grantItem,
  removeItem,
  checkOwnership,
} from "./inventory.controller";

const router = Router();

//////////////////////////////////////////////////
// ME
//////////////////////////////////////////////////

router.get(
  "/me",
  authMiddleware,
  getMyInventory
);

router.get(
  "/check/:itemId",
  authMiddleware,
  checkOwnership
);

//////////////////////////////////////////////////
// ADMIN
//////////////////////////////////////////////////

router.post(
  "/grant",
  authMiddleware,
  roleMiddleware(
    SystemRole.ADMIN
  ),
  grantItem
);

router.delete(
  "/remove",
  authMiddleware,
  roleMiddleware(
    SystemRole.ADMIN
  ),
  removeItem
);

//////////////////////////////////////////////////
// PUBLIC
//////////////////////////////////////////////////

router.get(
  "/:username",
  getUserInventory
);

export default router;