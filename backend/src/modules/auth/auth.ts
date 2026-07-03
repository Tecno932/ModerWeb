import { Router } from "express";

import { authMiddleware, } from "../../middleware/auth.middleware";
import {
  register,
  login,
  me,
  refresh,
  logout,
  logoutAll,
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

//////////////////////////////////////////////////
// AUTH
//////////////////////////////////////////////////

router.post(
  "/refresh",
  refresh
);

//////////////////////////////////////////////////
// LOGOUT
//////////////////////////////////////////////////

router.post(
  "/logout",
  logout
);

router.post(
  "/logout-all",
  authMiddleware,
  logoutAll
);

export default router;