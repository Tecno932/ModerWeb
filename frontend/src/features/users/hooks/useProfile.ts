import { useQuery }
  from "@tanstack/react-query";

import { getProfile }
  from "../api";

export function useProfile(
  username: string
) {
  return useQuery({
    queryKey: [
      "profile",
      username,
    ],

    queryFn: () =>
      getProfile(username),

    enabled: !!username,
  });
}