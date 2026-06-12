import "dotenv/config";
import express from "express";
import cors from "cors";
import { initRedis } from "./lib/redis";
import path from "path";
import multer from "multer";

import modRoutes from "./routes/mod";
import uploadsRoutes from "./routes/upload";
import versionRoutes from "./routes/version";
import fileRoutes from "./routes/file";
import downloadRoutes from "./routes/download";
import { rateLimit } from "./middleware/rateLimit.middleware";

import { register, login } from "./routes/auth";
import { authMiddleware } from "./middleware/auth.middleware";
import { errorHandler } from "./middleware/errorHandler.middleware";

import interactionsRoutes from "./modules/interactions/interactions.routes";
import commentRoutes from "./routes/comment";

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
app.post("/auth/register", register);
app.post("/auth/login", login);

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

// HEALTH
app.get("/", (_, res) => {
  res.send("API OK 🚀");
});

// ERROR HANDLER
app.use((err: any, req: any, res: any, next: any) => {
  console.error(err);

  if (err instanceof multer.MulterError) {
    return res.status(400).json({ error: err.message });
  }

  res.status(500).json({ error: err.message || "Error interno" });
});

//app.use(rateLimit({ window: 60, limit: 5 })); // global rate limit
app.use(errorHandler);

app.listen(3000, () => {
  console.log("API running on http://192.168.0.110:3000");
});