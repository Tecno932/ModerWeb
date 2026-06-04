import { apiFetch } from "@/shared/api/client";

//////////////////////////////////////////////////////
// TYPES
//////////////////////////////////////////////////////

export type GetModsParams = {
  page?: number;

  limit?: number;

  query?: string;

  platform?: string;

  loader?: string;

  sort?: string;

  authorId?: number;
};

//////////////////////////////////////////////////////
// GET MODS
//////////////////////////////////////////////////////

export function getMods(
  params?: GetModsParams
) {
  const search =
    new URLSearchParams();

  //////////////////////////////////////////////////
  // PAGINATION
  //////////////////////////////////////////////////

  search.set(
    "page",
    String(params?.page || 1)
  );

  if (params?.limit) {
    search.set(
      "limit",
      String(params.limit)
    );
  }

  //////////////////////////////////////////////////
  // SEARCH
  //////////////////////////////////////////////////

  if (params?.query) {
    search.set(
      "query",
      params.query
    );
  }

  //////////////////////////////////////////////////
  // FILTERS
  //////////////////////////////////////////////////

  if (params?.platform) {
    search.set(
      "platform",
      params.platform
    );
  }

  if (params?.authorId) {
    search.set(
      "authorId",
      String(params.authorId)
    );
  }

  //////////////////////////////////////////////////
  // SORT
  //////////////////////////////////////////////////

  if (params?.sort) {
    search.set(
      "sort",
      params.sort
    );
  }

  return apiFetch(
    `/mods?${search.toString()}`
  );
}

//////////////////////////////////////////////////////
// GET MOD
//////////////////////////////////////////////////////

export function getMod(
  slug: string
) {
  return apiFetch(
    `/mods/${slug}`
  );
}

//////////////////////////////////////////////////////
// CREATE MOD
//////////////////////////////////////////////////////

export async function createMod(
  formData: FormData
) {
  const token =
    localStorage.getItem("token");

  const res = await fetch(
    `${
      import.meta.env
        .VITE_API_URL
    }/mods`,
    {
      method: "POST",

      body: formData,

      headers: {
        ...(token
          ? {
              Authorization: `Bearer ${token}`,
            }
          : {}),
      },
    }
  );

  const data = await res
    .json()
    .catch(() => null);

  if (!res.ok) {
    throw new Error(
      data?.error ||
        "Error creando mod"
    );
  }

  return data;
}