import { BadRequestError } from "../../utils/errors";

import type {
  LoginInput,
  RegisterInput,
} from "./auth.types";

import {
  PASSWORD_MAX_LENGTH,
  PASSWORD_MIN_LENGTH,
  USERNAME_MAX_LENGTH,
  USERNAME_MIN_LENGTH,
} from "./auth.constants";

const usernameRegex =
  /^[a-zA-Z0-9_-]+$/;

const emailRegex =
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateRegister(
  data: RegisterInput
) {
  const {
    username,
    email,
    password,
  } = data;

  if (
    !username ||
    !email ||
    !password
  ) {
    throw new BadRequestError(
      "Faltan campos obligatorios"
    );
  }

  if (
    username.length <
    USERNAME_MIN_LENGTH
  ) {
    throw new BadRequestError(
      `El usuario debe tener al menos ${USERNAME_MIN_LENGTH} caracteres`
    );
  }

  if (
    username.length >
    USERNAME_MAX_LENGTH
  ) {
    throw new BadRequestError(
      `El usuario no puede superar los ${USERNAME_MAX_LENGTH} caracteres`
    );
  }

  if (
    !usernameRegex.test(username)
  ) {
    throw new BadRequestError(
      "Username inválido"
    );
  }

  if (
    !emailRegex.test(email)
  ) {
    throw new BadRequestError(
      "Email inválido"
    );
  }

  if (
    password.length <
    PASSWORD_MIN_LENGTH
  ) {
    throw new BadRequestError(
      "La contraseña es muy corta"
    );
  }

  if (
    password.length >
    PASSWORD_MAX_LENGTH
  ) {
    throw new BadRequestError(
      "La contraseña es demasiado larga"
    );
  }
}

export function validateLogin(
  data: LoginInput
) {
  const {
    email,
    password,
  } = data;

  if (
    !email ||
    !password
  ) {
    throw new BadRequestError(
      "Faltan campos"
    );
  }
}