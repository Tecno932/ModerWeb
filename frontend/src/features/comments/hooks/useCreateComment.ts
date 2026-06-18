import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { createComment } from "../api";

import { queryKeys } from "@/shared/lib/queryKeys";

export function useCreateComment(
  modId: number
) {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: (
      content: string
    ) =>
      createComment(
        modId,
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