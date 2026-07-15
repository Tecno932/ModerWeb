import { Router } from "express";
import { download } from "./download.controller";

const router = Router();

// 🔥 descarga por VERSION (como vos ya venías haciendo)
router.get("/versions/:versionId/download", download);

export default router;