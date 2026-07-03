import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { followUser }
  from "../api";

export function useFollow() {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: followUser,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["profile"],
      });

      queryClient.invalidateQueries({
        queryKey: ["me"],
      });
    },
  });
}