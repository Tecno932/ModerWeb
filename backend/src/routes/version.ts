import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware";
import { createVersion, getVersions, deleteVersion, updateVersion, } from "../controllers/version.controller";

const router = Router();

// CREATE VERSION
router.post("/:id/versions", authMiddleware, createVersion);

// GET VERSIONS
router.get("/:id/versions", getVersions);

router.delete("/:id", authMiddleware, deleteVersion);

router.patch("/:id", authMiddleware, updateVersion);

export default router;