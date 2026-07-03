import { prisma } from "../../lib/prisma";
import bcrypt from "bcryptjs";

import {
  BadRequestError,
  NotFoundError,
  UnauthorizedError,
} from "../../utils/errors";

import {
  generateAccessToken,
  generateRefreshToken,
} from "./auth.tokens";

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

  if (username.length < 3) {
    throw new BadRequestError(
      "El usuario debe tener al menos 3 caracteres"
    );
  }

  if (username.length > 32) {
    throw new BadRequestError(
      "El usuario no puede superar los 32 caracteres"
    );
  }

  const usernameRegex =
    /^[a-zA-Z0-9_-]+$/;

  if (!usernameRegex.test(username)) {
    throw new BadRequestError(
      "Username inválido"
    );
  }

  const emailRegex =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(email)) {
    throw new BadRequestError(
      "Email inválido"
    );
  }

  if (password.length < 8) {
    throw new BadRequestError(
      "La contraseña es muy corta"
    );
  }

  if (password.length > 128) {
    throw new BadRequestError(
      "La contraseña es demasiado larga"
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

  const { password: _, ...safeUser } =
    user;

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

      select: {
        id: true,

        username: true,
        email: true,

        role: true,

        isVerified: true,

        createdAt: true,
        updatedAt: true,

        lastLoginAt: true,

        profile: {
          select: {
            displayName: true,

            avatarUrl: true,
            bannerUrl: true,

            bio: true,

            accentColor: true,
          },
        },
      },
    });

  const accessToken =
    generateAccessToken(
      user.id
    );

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

        role: true,

        isVerified: true,

        createdAt: true,
        updatedAt: true,

        lastLoginAt: true,

        profile: {
          select: {
            displayName: true,

            avatarUrl: true,
            bannerUrl: true,

            bio: true,

            accentColor: true,
          },
        },
      },
    });

  if (!user) {
    throw new NotFoundError(
      "Usuario no encontrado"
    );
  }

  return user;
}

//////////////////////////////////////////////////
// TOKEN
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

      include: {
        user: true,
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

  const accessToken =
    generateAccessToken(
      storedToken.userId
    );

  return {
    accessToken,
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