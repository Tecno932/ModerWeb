import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { updateComment } from "../api";

import { queryKeys } from "@/shared/lib/queryKeys";

export function useUpdateComment(
  modId: number
) {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: ({
      commentId,
      content,
    }: {
      commentId: number;
      content: string;
    }) =>
      updateComment(
        commentId,
        content
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