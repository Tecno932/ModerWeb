import { useQuery }
  from "@tanstack/react-query";

import {
  getMyInventory,
} from "../api";

export function useMyInventory() {
  const token =
    localStorage.getItem(
      "token"
    );

  return useQuery({
    queryKey: [
      "inventory",
      "me",
    ],

    queryFn: () =>
      getMyInventory(
        token ?? ""
      ),

    enabled: !!token,
  });
}