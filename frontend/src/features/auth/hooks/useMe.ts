import { useQuery }
  from "@tanstack/react-query";

import { getMe }
  from "../api";

export function useMe(
  token: string | null
) {
  return useQuery({
    queryKey: ["me"],

    queryFn: () =>
      getMe(token!),

    enabled: !!token,
  });
}