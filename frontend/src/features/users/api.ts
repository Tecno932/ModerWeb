import { API_URL }
  from "@/shared/config/env";

export async function getProfile(
  username: string
) {
  const res = await fetch(
    `${API_URL}/users/${username}`
  );

  if (!res.ok) {
    throw new Error(
      "Usuario no encontrado"
    );
  }

  return res.json();
}

//////////////////////////////////////////////////
// GET CURRENT USER
//////////////////////////////////////////////////

export async function getMe(
  token: string
) {
  const res = await fetch(
    `${API_URL}/users/me`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!res.ok) {
    throw new Error(
      "Error obteniendo usuario"
    );
  }

  return res.json();
}

//////////////////////////////////////////////////
// UPDATE PROFILE
//////////////////////////////////////////////////

export async function updateProfile(
  token: string,
  data: {
    username?: string;
    bio?: string;
  }
) {
  const res = await fetch(
    `${API_URL}/users/me`,
    {
      method: "PATCH",

      headers: {
        "Content-Type":
          "application/json",

        Authorization: `Bearer ${token}`,
      },

      body: JSON.stringify(data),
    }
  );

  if (!res.ok) {
    const error =
      await res.json();

    throw new Error(
      error.error ||
        "Error actualizando perfil"
    );
  }

  return res.json();
}