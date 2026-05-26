import { Router } from "express";
import { authMiddleware, AuthRequest } from "../middleware/auth.middleware";
import {
  addFavorite,
  removeFavorite,
  getFavoriteStatus,
  getFavoritesByUser,
} from "../services/favorite.service";

const router = Router();

// ⭐ Agregar a favoritos
router.post("/:modId", authMiddleware, async (req: AuthRequest, res) => {
  try {
    const userId = req.userId!;
    const modId = Number(req.params.modId);

    const result = await addFavorite(userId, modId);

    if (result.alreadyFavorited) {
      return res.status(409).json({ message: "Already favorited" });
    }

    res.json(result);
  } catch {
    res.status(500).json({ error: "Error adding favorite" });
  }
});

// ❌ Quitar de favoritos
router.delete("/:modId", authMiddleware, async (req: AuthRequest, res) => {
  try {
    const userId = req.userId!;
    const modId = Number(req.params.modId);

    const result = await removeFavorite(userId, modId);

    res.json(result);
  } catch {
    res.status(500).json({ error: "Error removing favorite" });
  }
});

// 👤 Ver si está en favoritos
router.get("/:modId/me", authMiddleware, async (req: AuthRequest, res) => {
  const userId = req.userId!;
  const modId = Number(req.params.modId);

  const result = await getFavoriteStatus(userId, modId);

  res.json(result);
});

// 📚 Obtener favoritos del usuario
router.get("/me/list", authMiddleware, async (req: AuthRequest, res) => {
  const userId = req.userId!;

  const result = await getFavoritesByUser(userId);

  res.json(result);
});

export default router;