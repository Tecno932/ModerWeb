import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import {
  unequipCosmetic,
} from "../api";

export function useUnequipCosmetic() {
  const queryClient =
    useQueryClient();

  const token =
    localStorage.getItem(
      "token"
    ) ?? "";

  return useMutation({
    mutationFn: (
      type: string
    ) =>
      unequipCosmetic(
        token,
        type
      ),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [
          "equipped",
        ],
      });

      queryClient.invalidateQueries({
        queryKey: [
          "profile",
        ],
      });
    },
  });
}