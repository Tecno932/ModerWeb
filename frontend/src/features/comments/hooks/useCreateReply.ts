import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { createReply } from "../api";

import { queryKeys } from "@/shared/lib/queryKeys";

export function useCreateReply(
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
      createReply(
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