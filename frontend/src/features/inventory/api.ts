import { API_URL }
  from "@/shared/config/env";

export async function getMyInventory(
  token: string
) {
  const res = await fetch(
    `${API_URL}/inventory/me`,
    {
      headers: {
        Authorization:
          `Bearer ${token}`,
      },
    }
  );

  if (!res.ok) {
    throw new Error(
      "Error cargando inventario"
    );
  }

  return res.json();
}