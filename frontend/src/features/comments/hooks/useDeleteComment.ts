import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { deleteComment } from "../api";

import { queryKeys } from "@/shared/lib/queryKeys";

export function useDeleteComment(
  modId: number
) {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: (
      commentId: number
    ) =>
      deleteComment(
        commentId
      ),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey:
          queryKeys.comments.byMod(
            modId
          ),
      });
    },
  });
}