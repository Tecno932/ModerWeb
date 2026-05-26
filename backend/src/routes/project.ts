import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware";

import {
  getProject,
  updateProject,
} from "../controllers/project/project.controller";

const router = Router();

// 🔥 dashboard
router.get("/:id", authMiddleware, getProject);

// 🔥 editar básico
router.patch("/:id", authMiddleware, updateProject);

export default router;