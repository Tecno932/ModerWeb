import { prisma } from "../lib/prisma";
import bcrypt from "bcryptjs";
import {  BadRequestError, NotFoundError, UnauthorizedError,} from "../utils/errors";

interface RegisterInput {
  username: string;
  email: string;
  password: string;
}

export async function registerUser(data: RegisterInput) {
  const { username, email, password } = data;

  // validación básica
  if (!username || !email || !password) {
    throw new BadRequestError("Faltan campos obligatorios");
  }

  if (password.length < 8) {
    throw new BadRequestError("La contraseña es muy corta");
  }

  // validar duplicados
  const existingUser = await prisma.user.findFirst({
    where: {
      OR: [{ username }, { email }],
    },
  });

  if (existingUser) {
    throw new BadRequestError("Usuario o email ya existe");
  }

  const hashed = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      username,
      email,
      password: hashed,
    },
  });

  // eliminar password
  const { password: _, ...safeUser } = user;

  return safeUser;
}

// ---- Login ---- 
import jwt from "jsonwebtoken";

export async function loginUser(data: {
  email: string;
  password: string;
}) {
  const { email, password } = data;

  if (!email || !password) {
    throw new BadRequestError("Faltan campos");
  }

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new NotFoundError("Usuario no encontrado");
  }

  const valid = await bcrypt.compare(password, user.password);

  if (!valid) {
    throw new UnauthorizedError("Contraseña incorrecta");
  }

  const token = jwt.sign(
    { userId: user.id },
    process.env.JWT_SECRET || "secret",
    { expiresIn: "7d" }
  );

  const { password: _, ...safeUser } = user;

  return { user: safeUser, token };
}