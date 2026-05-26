const API = "http://192.168.0.110:3000";

export async function toggleLike(modId: number, token: string) {
  const res = await fetch(`${API}/mods/${modId}/like`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error("Like error");

  return res.json();
}

export async function getLiked(modId: number, token: string) {
  const res = await fetch(`${API}/mods/${modId}/like`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.json();
}