import { apiFetch } from "@/shared/api/client";

import type { ModInteractions } from "./types";

export function getInteractions(
  modId: number
) {
  return apiFetch<ModInteractions>(
    `/mods/${modId}/interactions`
  );
}

export function toggleLike(
  modId: number
) {
  return apiFetch(
    `/mods/${modId}/like`,
    {
      method: "POST",
    }
  );
}

export function toggleFavorite(
  modId: number
) {
  return apiFetch(
    `/mods/${modId}/favorite`,
    {
      method: "POST",
    }
  );
}