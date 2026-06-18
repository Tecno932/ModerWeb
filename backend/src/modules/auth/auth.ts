import { Router } from "express";

import { authMiddleware, } from "../../middleware/auth.middleware";
import {
  login,
  register,
  me,
} from "./auth.controller";

const router = Router();

//////////////////////////////////////////////////
// AUTH
//////////////////////////////////////////////////

router.post(
  "/register",
  register
);

router.post(
  "/login",
  login
);

router.get(
  "/me",
  authMiddleware,
  me
);

export default router;