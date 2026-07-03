import { Router } from "express";

import {
  getCosmetics,
  getCosmetic,
  createCosmetic,
  updateCosmetic,
  activateCosmetic,
  deactivateCosmetic,
  deleteCosmetic,
} from "./cosmetics.controller";

const router = Router();

//////////////////////////////////////////////////
// PUBLIC
//////////////////////////////////////////////////

router.get(
  "/",
  getCosmetics
);

router.get(
  "/:slug",
  getCosmetic
);

//////////////////////////////////////////////////
// ADMIN
//////////////////////////////////////////////////

router.post(
  "/",
  createCosmetic
);

router.patch(
  "/:id",
  updateCosmetic
);

router.patch(
  "/:id/activate",
  activateCosmetic
);

router.patch(
  "/:id/deactivate",
  deactivateCosmetic
);

router.delete(
  "/:id",
  deleteCosmetic
);

export default router;