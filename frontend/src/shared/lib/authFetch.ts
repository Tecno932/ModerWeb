export async function authFetch(url: string, options: RequestInit = {}) {
  const token = localStorage.getItem("token");

  const res = await fetch(url, {
    ...options,
    headers: {
      ...(options.headers || {}),
      Authorization: token ? `Bearer ${token}` : "",
    },
  });

  // 🚨 HANDLE GLOBAL 401
  if (res.status === 401) {
    console.warn("🔒 Usuario no autenticado o token inválido");

    // 🔥 limpiar sesión
    localStorage.removeItem("token");

    // opcional: limpiar otros datos
    localStorage.removeItem("user");

    // 🚀 redirect HARD (evita estados rotos)
    window.location.href = "/login";

    throw new Error("Unauthorized");
  }

  return res;
}