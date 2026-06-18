import { prisma } from "../../lib/prisma";

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import {
  BadRequestError,
  NotFoundError,
  UnauthorizedError,
} from "../../utils/errors";

import {
  RegisterInput,
  LoginInput,
} from "./auth.types";

//////////////////////////////////////////////////
// REGISTER
//////////////////////////////////////////////////

export async function registerUser(
  data: RegisterInput
) {
  const {
    username,
    email,
    password,
  } = data;

  if (!username || !email || !password) {
    throw new BadRequestError(
      "Faltan campos obligatorios"
    );
  }

  if (password.length < 8) {
    throw new BadRequestError(
      "La contraseña es muy corta"
    );
  }

  const existingUser =
    await prisma.user.findFirst({
      where: {
        OR: [
          { username },
          { email },
        ],
      },
    });

  if (existingUser) {
    throw new BadRequestError(
      "Usuario o email ya existe"
    );
  }

  const hashed =
    await bcrypt.hash(password, 10);

  const user =
    await prisma.user.create({
      data: {
        username,
        email,
        password: hashed,
      },
    });

  const { password: _, ...safeUser } = user;

  return safeUser;
}

//////////////////////////////////////////////////
// LOGIN
//////////////////////////////////////////////////

export async function loginUser(
  data: LoginInput
) {
  const {
    email,
    password,
  } = data;

  if (!email || !password) {
    throw new BadRequestError(
      "Faltan campos"
    );
  }

  const user =
    await prisma.user.findUnique({
      where: {
        email,
      },
    });

  if (!user) {
    throw new NotFoundError(
      "Usuario no encontrado"
    );
  }

  const valid =
    await bcrypt.compare(
      password,
      user.password
    );

  if (!valid) {
    throw new UnauthorizedError(
      "Contraseña incorrecta"
    );
  }

  await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      lastLoginAt: new Date(),
    },
  });

  const token = jwt.sign(
    {
      userId: user.id,
    },
    process.env.JWT_SECRET || "secret",
    {
      expiresIn: "7d",
    }
  );

  const { password: _, ...safeUser } = user;

  return {
    user: safeUser,
    token,
  };
}

//////////////////////////////////////////////////
// GET CURRENT USER
//////////////////////////////////////////////////

export async function getCurrentUser(
  userId: number
) {
  const user =
    await prisma.user.findUnique({
      where: {
        id: userId,
      },

      select: {
        id: true,
        username: true,
        email: true,

        avatar: true,
        bio: true,

        role: true,

        isVerified: true,

        createdAt: true,
        updatedAt: true,

        lastLoginAt: true,
      },
    });

  if (!user) {
    throw new NotFoundError(
      "Usuario no encontrado"
    );
  }

  return user;
}