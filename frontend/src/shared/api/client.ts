import { normalizeError } from "./error";
import { refreshAccessToken, } from "@/features/auth/api";

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
    const refreshToken =
      localStorage.getItem(
        "refreshToken"
      );

    if (refreshToken) {
      try {
        const result =
          await refreshAccessToken(
            refreshToken
          );

        localStorage.setItem(
          "token",
          result.accessToken
        );

        //////////////////////////////////////////////////
        // REPEAT REQUEST
        //////////////////////////////////////////////////

        const retry =
          await fetch(
            `${API_URL}${endpoint}`,
            {
              ...options,

              headers: {
                "Content-Type":
                  "application/json",

                Authorization:
                  `Bearer ${result.accessToken}`,

                ...options.headers,
              },
            }
          );

        const retryData =
          await retry.json();

        if (!retry.ok) {
          throw new Error();
        }

        return retryData;
      } catch {
        console.log(
          "Refresh expirado"
        );
      }
    }

    //////////////////////////////////////////////////
    // LOGOUT
    //////////////////////////////////////////////////

    localStorage.removeItem(
      "token"
    );

    localStorage.removeItem(
      "refreshToken"
    );

    localStorage.removeItem(
      "user"
    );

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