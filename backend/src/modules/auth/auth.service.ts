import bcrypt from "bcryptjs";

import { prisma } from "../../lib/prisma";

import {
  BadRequestError,
  NotFoundError,
  UnauthorizedError,
} from "../../utils/errors";

import {
  generateAccessToken,
  generateRefreshToken,
} from "./auth.tokens";

import type {
  LoginInput,
  RegisterInput,
} from "./auth.types";

import {
  validateLogin,
  validateRegister,
} from "./auth.validation";

import {
  authUserSelect,
} from "./auth.select";

import {
  toSafeUser,
} from "./auth.mapper";

//////////////////////////////////////////////////
// REGISTER
//////////////////////////////////////////////////

export async function registerUser(
  data: RegisterInput
) {
  validateRegister(data);

  const {
    username,
    email,
    password,
  } = data;

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
    await prisma.$transaction(
      async (tx) => {
        const createdUser =
          await tx.user.create({
            data: {
              username,
              email,
              password: hashed,
            },
          });

        await tx.userProfile.create({
          data: {
            userId:
              createdUser.id,
          },
        });

        return createdUser;
      }
    );

  return toSafeUser(user);
}

//////////////////////////////////////////////////
// LOGIN
//////////////////////////////////////////////////

export async function loginUser(
  data: LoginInput
) {
  validateLogin(data);

  const {
    email,
    password,
  } = data;

  const user =
    await prisma.user.findUnique({
      where: {
        email,
      },
    });

  if (!user) {
    throw new UnauthorizedError(
      "Credenciales inválidas"
    );
  }

  const valid =
    await bcrypt.compare(
      password,
      user.password
    );

  if (!valid) {
    throw new UnauthorizedError(
      "Credenciales inválidas"
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

  const safeUser =
    await prisma.user.findUnique({
      where: {
        id: user.id,
      },
      select: authUserSelect,
    });

  const accessToken =
    generateAccessToken(user.id);

  const refreshToken =
    generateRefreshToken();

  await prisma.refreshToken.create({
    data: {
      token: refreshToken,
      userId: user.id,
      expiresAt: new Date(
        Date.now() +
          1000 * 60 * 60 * 24 * 30
      ),
    },
  });

  return {
    user: safeUser,
    accessToken,
    refreshToken,
  };
}

//////////////////////////////////////////////////
// CURRENT USER
//////////////////////////////////////////////////

export async function getCurrentUser(
  userId: number
) {
  const user =
    await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: authUserSelect,
    });

  if (!user) {
    throw new NotFoundError(
      "Usuario no encontrado"
    );
  }

  return user;
}

//////////////////////////////////////////////////
// REFRESH TOKEN
//////////////////////////////////////////////////

export async function refreshAccessToken(
  refreshToken: string
) {
  if (!refreshToken) {
    throw new BadRequestError(
      "Refresh token requerido"
    );
  }

  const storedToken =
    await prisma.refreshToken.findUnique({
      where: {
        token: refreshToken,
      },
    });

  if (!storedToken) {
    throw new UnauthorizedError(
      "Refresh token inválido"
    );
  }

  if (
    storedToken.expiresAt <
    new Date()
  ) {
    await prisma.refreshToken.delete({
      where: {
        id: storedToken.id,
      },
    });

    throw new UnauthorizedError(
      "Refresh token expirado"
    );
  }

  return {
    accessToken:
      generateAccessToken(
        storedToken.userId
      ),
  };
}

//////////////////////////////////////////////////
// LOGOUT
//////////////////////////////////////////////////

export async function logoutUser(
  refreshToken: string
) {
  if (!refreshToken) {
    throw new BadRequestError(
      "Refresh token requerido"
    );
  }

  await prisma.refreshToken.deleteMany({
    where: {
      token: refreshToken,
    },
  });

  return {
    message: "Sesión cerrada",
  };
}

//////////////////////////////////////////////////
// LOGOUT ALL
//////////////////////////////////////////////////

export async function logoutAllSessions(
  userId: number
) {
  await prisma.refreshToken.deleteMany({
    where: {
      userId,
    },
  });

  return {
    message:
      "Todas las sesiones cerradas",
  };
}