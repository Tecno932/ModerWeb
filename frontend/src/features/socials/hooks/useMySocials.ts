import { useQuery }
  from "@tanstack/react-query";

import { getMySocials }
  from "../api";

export function useMySocials(
  token: string
) {
  return useQuery({
    queryKey: ["my-socials"],

    queryFn: () =>
      getMySocials(token),

    enabled: !!token,
  });
}