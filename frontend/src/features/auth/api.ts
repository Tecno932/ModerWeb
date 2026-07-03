import { API_URL } from "../../shared/config/env";
import { apiFetch } from "@/shared/api/client";

export const login = async (
  data: {
    email: string;
    password: string;
  }
) => {
  const res = await fetch(
    `${API_URL}/auth/login`,
    {
      method: "POST",
      headers: {
        "Content-Type":
          "application/json",
      },
      body: JSON.stringify(data),
    }
  );

  if (!res.ok) {
    const error =
      await res.json();

    throw new Error(
      error.error ||
      "Error en login"
    );
  }

  return res.json();
};

export const register = async (
  data: {
    email: string;
    password: string;
    username: string;
  }
) => {
  const res = await fetch(
    `${API_URL}/auth/register`,
    {
      method: "POST",
      headers: {
        "Content-Type":
          "application/json",
      },
      body: JSON.stringify(data),
    }
  );

  if (!res.ok) {
    const error =
      await res.json();

    throw new Error(
      error.error ||
      "Error en register"
    );
  }

  return res.json();
};

//////////////////////////////////////////////////
// ME
//////////////////////////////////////////////////

export const getMe =
  async () => {
    return apiFetch(
      "/auth/me"
    );
  };

//////////////////////////////////////////////////
// LOGOUT
//////////////////////////////////////////////////

export const logout = async (
  refreshToken: string
) => {
  await fetch(
    `${API_URL}/auth/logout`,
    {
      method: "POST",

      headers: {
        "Content-Type":
          "application/json",
      },

      body: JSON.stringify({
        refreshToken,
      }),
    }
  );
};

//////////////////////////////////////////////////
// REFRESH
//////////////////////////////////////////////////

export const refreshAccessToken =
  async (
    refreshToken: string
  ) => {
    const res = await fetch(
      `${API_URL}/auth/refresh`,
      {
        method: "POST",

        headers: {
          "Content-Type":
            "application/json",
        },

        body: JSON.stringify({
          refreshToken,
        }),
      }
    );

    if (!res.ok) {
      throw new Error(
        "Refresh expirado"
      );
    }

    return res.json();
  };