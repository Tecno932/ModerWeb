import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import {
  equipCosmetic,
} from "../api";

export function useEquipCosmetic() {
  const queryClient =
    useQueryClient();

  const token =
    localStorage.getItem(
      "token"
    ) ?? "";

  return useMutation({
    mutationFn: (
      cosmeticId: number
    ) =>
      equipCosmetic(
        token,
        cosmeticId
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