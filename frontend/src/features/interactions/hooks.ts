import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  getInteractions,
  toggleFavorite,
  toggleLike,
} from "./api";

import { queryKeys } from "@/shared/lib/queryKeys";

//////////////////////////////////////////////////////
// GET INTERACTIONS
//////////////////////////////////////////////////////

export function useInteractions(
  modId: number
) {
  return useQuery({
    queryKey:
      queryKeys.mods.interactions(
        modId
      ),

    queryFn: () =>
      getInteractions(modId),
  });
}

//////////////////////////////////////////////////////
// LIKE
//////////////////////////////////////////////////////

export function useToggleLike(
  modId: number,
  slug: string
) {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: () =>
      toggleLike(modId),

    //////////////////////////////////////////////////
    // OPTIMISTIC
    //////////////////////////////////////////////////

    onMutate: async () => {
      //////////////////////////////////////////////////
      // DETAIL CACHE KEY
      //////////////////////////////////////////////////

      const detailKey =
        queryKeys.mods.detail(
          slug
        );

      //////////////////////////////////////////////////
      // CANCEL
      //////////////////////////////////////////////////

      await queryClient.cancelQueries({
        queryKey: detailKey,
      });

      //////////////////////////////////////////////////
      // PREVIOUS
      //////////////////////////////////////////////////

      const previous =
        queryClient.getQueryData<any>(
          detailKey
        );

      //////////////////////////////////////////////////
      // OPTIMISTIC UPDATE
      //////////////////////////////////////////////////

      queryClient.setQueryData(
        detailKey,
        (old: any) => {
          if (!old) return old;

          const liked =
            !old.interactions
              ?.liked;

          return {
            ...old,

            interactions: {
              ...old.interactions,

              liked,
            },

            stats: {
              ...old.stats,

              likes: liked
                ? old.stats.likes +
                  1
                : Math.max(
                    0,
                    old.stats.likes -
                      1
                  ),
            },
          };
        }
      );

      return { previous };
    },

    //////////////////////////////////////////////////
    // ROLLBACK
    //////////////////////////////////////////////////

    onError: (
      _err,
      _vars,
      context
    ) => {
      queryClient.setQueryData(
        queryKeys.mods.detail(
          slug
        ),

        context?.previous
      );
    },

    //////////////////////////////////////////////////
    // FINAL SYNC
    //////////////////////////////////////////////////

    onSuccess: (data) => {
      queryClient.setQueryData(
        queryKeys.mods.detail(
          slug
        ),

        (old: any) => {
          if (!old) return old;

          return {
            ...old,

            interactions: {
              ...old.interactions,

              liked:
                data.liked,
            },

            stats: {
              ...old.stats,

              likes:
                data.likesCount,
            },
          };
        }
      );
    },
  });
}

//////////////////////////////////////////////////////
// FAVORITE
//////////////////////////////////////////////////////

export function useToggleFavorite(
  modId: number,
  slug: string
) {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: () =>
      toggleFavorite(modId),

    //////////////////////////////////////////////////
    // OPTIMISTIC
    //////////////////////////////////////////////////

    onMutate: async () => {
      const detailKey =
        queryKeys.mods.detail(
          slug
        );

      await queryClient.cancelQueries({
        queryKey: detailKey,
      });

      const previous =
        queryClient.getQueryData<any>(
          detailKey
        );

      queryClient.setQueryData(
        detailKey,
        (old: any) => {
          if (!old) return old;

          const favorited =
            !old.interactions
              ?.favorited;

          return {
            ...old,

            interactions: {
              ...old.interactions,

              favorited,
            },

            stats: {
              ...old.stats,

              favorites:
                favorited
                  ? old.stats
                      .favorites +
                    1
                  : Math.max(
                      0,
                      old.stats
                        .favorites -
                        1
                    ),
            },
          };
        }
      );

      return { previous };
    },

    //////////////////////////////////////////////////
    // ROLLBACK
    //////////////////////////////////////////////////

    onError: (
      _err,
      _vars,
      context
    ) => {
      queryClient.setQueryData(
        queryKeys.mods.detail(
          slug
        ),

        context?.previous
      );
    },

    //////////////////////////////////////////////////
    // FINAL SYNC
    //////////////////////////////////////////////////

    onSuccess: (data) => {
      queryClient.setQueryData(
        queryKeys.mods.detail(
          slug
        ),

        (old: any) => {
          if (!old) return old;

          return {
            ...old,

            interactions: {
              ...old.interactions,

              favorited:
                data.favorited,
            },

            stats: {
              ...old.stats,

              favorites:
                data.favoritesCount,
            },
          };
        }
      );
    },
  });
}