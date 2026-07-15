import "dotenv/config";
import express from "express";
import cors from "cors";
import { initRedis } from "./lib/redis";
import path from "path";
import multer from "multer";

import {
  NextFunction,
  Request,
  Response,
} from "express";

import modRoutes from "./modules/mod/mod.routes";
import uploadsRoutes from "./modules/uploads/upload.routes";
import versionRoutes from "./modules/versions/version.routes";
import fileRoutes from "./modules/files/file.routes";
import downloadRoutes from "./modules/downloads/download.routes";
import { rateLimit } from "./middleware/rateLimit.middleware";
import usersRoutes from "./modules/users/users.routes";

import authRoutes from "./modules/auth/auth.routes";
import { errorHandler } from "./middleware/errorHandler.middleware";

import interactionsRoutes from "./modules/interactions/interactions.routes";
import commentRoutes from "./modules/comments/comment.routes";
import followsRoutes from "./modules/follows/follows.routes";
import socialsRoutes from "./modules/socials/socials.routes";

import cosmeticsRoutes from "./modules/cosmetics/cosmetics.routes";
import inventoryRoutes from "./modules/inventory/inventory.routes";
import equippedRoutes from "./modules/equipped/equipped.routes";

const app = express();

initRedis();
app.use(express.json());
app.use(cors({
  origin: [
    "http://192.168.0.110:5173"
  ],
  credentials: true,
}));

// AUTH
app.use ("/auth", authRoutes );

// USER
app.use("/users", usersRoutes );

// MODS
app.use("/mods", modRoutes);

// VERSIONS
app.use("/mods", versionRoutes);

// FILES
app.use("/versions", fileRoutes);
app.use("/", downloadRoutes);

// STATIC
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));
app.use("/uploads", uploadsRoutes);

// ❤️ Likes & Favoritos
app.use("/mods", interactionsRoutes);

// 💬 Comments
app.use("/comments", commentRoutes);

// Follows
app.use("/follows", followsRoutes);

// Socials
app.use("/socials", socialsRoutes);

// Inventory
app.use("/cosmetics", cosmeticsRoutes);
app.use("/inventory", inventoryRoutes);
app.use("/equipped", equippedRoutes);

// HEALTH
app.get("/", (_, res) => {
  res.send("API OK 🚀");
});

// ERROR HANDLER
app.use(
  (
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
  ) => {

    console.error(err);

    if (err instanceof multer.MulterError) {
      return res.status(400).json({
        error: err.message,
      });
    }

    return res.status(500).json({
      error:
        err.message ||
        "Error interno",
    });
  }
);

//app.use(rateLimit({ window: 60, limit: 5 })); // global rate limit
app.use(errorHandler);

app.listen(3000, () => {
  console.log("API running on http://192.168.0.110:3000");
});