import { API_URL }
  from "@/shared/config/env";

//////////////////////////////////////////////////
// GET MY SOCIALS
//////////////////////////////////////////////////

export async function getMySocials(
  token: string
) {
  const res = await fetch(
    `${API_URL}/socials/me`,
    {
      headers: {
        Authorization:
          `Bearer ${token}`,
      },
    }
  );

  if (!res.ok) {
    throw new Error(
      "Error cargando redes"
    );
  }

  return res.json();
}

//////////////////////////////////////////////////
// SAVE SOCIAL
//////////////////////////////////////////////////

export async function saveSocial(
  token: string,
  data: {
    platform: string;
    url: string;
  }
) {
  const res = await fetch(
    `${API_URL}/socials/me`,
    {
      method: "PUT",

      headers: {
        "Content-Type":
          "application/json",

        Authorization:
          `Bearer ${token}`,
      },

      body:
        JSON.stringify(data),
    }
  );

  if (!res.ok) {
    const error =
      await res.json();

    throw new Error(
      error.error ??
      "Error guardando red"
    );
  }

  return res.json();
}

//////////////////////////////////////////////////
// DELETE SOCIAL
//////////////////////////////////////////////////

export async function deleteSocial(
  token: string,
  platform: string
) {
  const res = await fetch(
    `${API_URL}/socials/me/${platform}`,
    {
      method: "DELETE",

      headers: {
        Authorization:
          `Bearer ${token}`,
      },
    }
  );

  if (!res.ok) {
    throw new Error(
      "Error eliminando red"
    );
  }

  return res.json();
}