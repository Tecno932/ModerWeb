import { apiFetch } from "@/shared/api/client";

export async function createMod(
  formData: FormData
) {
  return apiFetch("/mods", {
    method: "POST",
    body: formData,
  });
}