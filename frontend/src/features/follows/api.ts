import { apiFetch }
  from "@/shared/api/client";

export async function followUser(
  username: string
) {
  return apiFetch(
    `/follows/${username}`,
    {
      method: "POST",
    }
  );
}

export async function unfollowUser(
  username: string
) {
  return apiFetch(
    `/follows/${username}`,
    {
      method: "DELETE",
    }
  );
}