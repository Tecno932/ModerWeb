import { Router } from "express";
import { getUserProfile } from "../services/user.service";
import { AuthRequest, authMiddleware } from "../middleware/auth.middleware";

const router = Router();

// 👤 Perfil público
router.get("/:username", async (req: AuthRequest, res) => {
  try {
    const usernameParam = req.params.username;

    if (Array.isArray(usernameParam)) {
    return res.status(400).json({ error: "Username inválido" });
    }

    const username = usernameParam;
    const userId = req.userId;

    const profile = await getUserProfile(username, userId);

    res.json(profile);
  } catch (err) {
    res.status(404).json({ error: "Usuario no encontrado" });
  }
});

export default router;