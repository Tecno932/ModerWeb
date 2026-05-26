import { Router, Response } from "express";
import { LikeController } from "../controllers/like.controller";
import { FavoriteController } from "../controllers/favorite.controller";
import { authMiddleware, AuthRequest } from "../middleware/auth.middleware";
import { asyncHandler } from "../utils/asyncHandler";

const router = Router();

// ─── LIKES ───────────────────────────────────────────

router.post(
  "/:modId/like",
  authMiddleware,
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const modId = Number(req.params.modId);
    const userId = req.userId!;

    if (!modId) return res.status(400).json({ error: "modId inválido" });

    const result = await LikeController.toggleLike(userId, modId);
    res.json(result);
  })
);

router.get(
  "/:modId/like",
  authMiddleware,
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const modId = Number(req.params.modId);
    const liked = await LikeController.isLiked(req.userId!, modId);
    res.json({ liked });
  })
);

router.get(
  "/:modId/likes/count",
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const modId = Number(req.params.modId);
    const count = await LikeController.getLikesCount(modId);
    res.json({ count });
  })
);

// ─── FAVORITOS ───────────────────────────────────────

router.post(
  "/:modId/favorite",
  authMiddleware,
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const modId = Number(req.params.modId);
    const userId = req.userId!;

    if (!modId) return res.status(400).json({ error: "modId inválido" });

    const result = await FavoriteController.toggleFavorite(userId, modId);
    res.json(result);
  })
);

router.get(
  "/:modId/favorite",
  authMiddleware,
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const modId = Number(req.params.modId);
    const favorited = await FavoriteController.isFavorited(req.userId!, modId);
    res.json({ favorited });
  })
);

export default router;