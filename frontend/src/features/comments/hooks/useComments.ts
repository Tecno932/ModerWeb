import { useQuery } from "@tanstack/react-query";

import { getComments } from "../api";

import { queryKeys } from "@/shared/lib/queryKeys";

export function useComments(
  modId: number
) {
  return useQuery({
    queryKey:
      queryKeys.comments.byMod(
        modId
      ),

    queryFn: () =>
      getComments(modId),
  });
}