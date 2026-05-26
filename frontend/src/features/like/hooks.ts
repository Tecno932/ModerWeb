import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { toggleLike, getLiked } from "./api";

export function useLiked(modId: number, token: string | null) {
  return useQuery({
    queryKey: ["liked", modId],
    queryFn: () => getLiked(modId, token!),
    enabled: !!token,
  });
}

export function useToggleLike(modId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ token }: { token: string }) =>
      toggleLike(modId, token),

    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["mod"] });

      const previous = queryClient.getQueryData<any>(["mod"]);

      // 🔥 optimistic update
      queryClient.setQueryData(["mod"], (old: any) => {
        if (!old) return old;

        return {
          ...old,
          likesCount: old.likesCount + 1,
        };
      });

      return { previous };
    },

    onError: (_err, _vars, context) => {
      queryClient.setQueryData(["mod"], context?.previous);
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["mod"] });
      queryClient.invalidateQueries({ queryKey: ["liked"] });
    },
  });
}