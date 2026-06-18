import { API_URL } from "../../shared/config/env";

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
    throw new Error(
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
  async (token: string) => {
    const res = await fetch(
      `${API_URL}/auth/me`,
      {
        headers: {
          Authorization:
            `Bearer ${token}`,
        },
      }
    );

    if (!res.ok) {
      throw new Error(
        "No autorizado"
      );
    }

    return res.json();
  };