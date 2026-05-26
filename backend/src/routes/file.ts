import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware";
import { registerFile } from "../controllers/versionFile.controller";

const router = Router();

router.post("/:id/files", authMiddleware, async (req, res) => {
  try {
    const file = await registerFile(req);
    res.json(file);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

export default router;