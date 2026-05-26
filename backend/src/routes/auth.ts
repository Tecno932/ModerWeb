import { Request, Response } from "express";
import { registerUser, loginUser } from "../controllers/auth.controller";

export async function register(req: Request, res: Response) {
  try {
    const { username, email, password } = req.body;

    const user = await registerUser({
      username,
      email,
      password,
    });

    res.status(201).json(user);
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Error desconocido";

    res.status(400).json({ error: message });
  }
}

// 👇 NUEVO
export async function login(req: Request, res: Response) {
  try {
    const { email, password } = req.body;

    const data = await loginUser({ email, password });

    res.json(data);
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Error desconocido";

    res.status(400).json({ error: message });
  }
}