import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { deleteSocial }
  from "../api";

export function useDeleteSocial(
  token: string
) {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: (
      platform: string
    ) =>
      deleteSocial(
        token,
        platform
      ),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [
          "my-socials",
        ],
      });

      queryClient.invalidateQueries({
        queryKey: ["me"],
      });

      queryClient.invalidateQueries({
        queryKey: ["profile"],
      });
    },
  });
}