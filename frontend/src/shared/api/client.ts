import { normalizeError } from "./error";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://192.168.0.110:3000";

export async function apiFetch<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  ////////////////////////////////////////////////////
  // TOKEN
  ////////////////////////////////////////////////////

  const token =
    localStorage.getItem("token");

  ////////////////////////////////////////////////////
  // REQUEST
  ////////////////////////////////////////////////////

  const res = await fetch(
    `${API_URL}${endpoint}`,
    {
      ...options,

      headers: {
        "Content-Type":
          "application/json",

        ...(token
          ? {
              Authorization: `Bearer ${token}`,
            }
          : {}),

        ...options.headers,
      },
    }
  );

  ////////////////////////////////////////////////////
  // JSON
  ////////////////////////////////////////////////////

  const data = await res
    .json()
    .catch(() => null);

  ////////////////////////////////////////////////////
  // AUTH EXPIRED
  ////////////////////////////////////////////////////

  if (res.status === 401) {
    localStorage.removeItem(
      "token"
    );

    localStorage.removeItem(
      "user"
    );

    //////////////////////////////////////////////////
    // REDIRECT
    //////////////////////////////////////////////////

    if (
      window.location.pathname !==
      "/login"
    ) {
      window.location.href =
        "/login";
    }

    throw new Error(
      "Sesión expirada"
    );
  }

  ////////////////////////////////////////////////////
  // NORMAL ERROR
  ////////////////////////////////////////////////////

  if (!res.ok) {
    throw normalizeError(data);
  }

  return data;
}