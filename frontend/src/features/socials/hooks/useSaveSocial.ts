import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { saveSocial }
  from "../api";

export function useSaveSocial(
  token: string
) {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: (
      data: {
        platform: string;
        url: string;
      }
    ) =>
      saveSocial(
        token,
        data
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