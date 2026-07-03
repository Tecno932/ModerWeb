import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { unfollowUser }
  from "../api";

export function useUnfollow() {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: unfollowUser,

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