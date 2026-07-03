import { API_URL }
  from "@/shared/config/env";

export async function getMyEquipped(
  token: string
) {
  const res = await fetch(
    `${API_URL}/equipped/me`,
    {
      headers: {
        Authorization:
          `Bearer ${token}`,
      },
    }
  );

  if (!res.ok) {
    throw new Error(
      "Error cargando equipados"
    );
  }

  return res.json();
}

export async function equipCosmetic(
  token: string,
  cosmeticId: number
) {
  const res = await fetch(
    `${API_URL}/equipped/equip`,
    {
      method: "POST",

      headers: {
        "Content-Type":
          "application/json",

        Authorization:
          `Bearer ${token}`,
      },

      body: JSON.stringify({
        cosmeticId,
      }),
    }
  );

  if (!res.ok) {
    throw new Error(
      "Error equipando"
    );
  }

  return res.json();
}

export async function unequipCosmetic(
  token: string,
  type: string
) {
  const res = await fetch(
    `${API_URL}/equipped/unequip/${type}`,
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
      "Error desequipando"
    );
  }

  return res.json();
}