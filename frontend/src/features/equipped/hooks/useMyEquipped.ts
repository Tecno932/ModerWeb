import { useQuery }
  from "@tanstack/react-query";

import {
  getMyEquipped,
} from "../api";

export function useMyEquipped() {
  const token =
    localStorage.getItem(
      "token"
    );

  return useQuery({
    queryKey: [
      "equipped",
      "me",
    ],

    queryFn: () =>
      getMyEquipped(
        token ?? ""
      ),

    enabled: !!token,
  });
}