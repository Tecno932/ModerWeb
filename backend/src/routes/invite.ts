import { Router } from "express";
import {
  createInvite,
  acceptInvite,
  rejectInvite,
} from "../controllers/invite.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();

router.post("/", authMiddleware, createInvite);
router.post("/accept/:token", authMiddleware, acceptInvite);
router.post("/reject/:token", authMiddleware, rejectInvite);

export default router;