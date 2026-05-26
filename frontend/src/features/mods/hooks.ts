import { useQuery } from "@tanstack/react-query";

import {
  getMod,
  getMods,
  type GetModsParams,
} from "./api";

import { queryKeys } from "@/shared/lib/queryKeys";

//////////////////////////////////////////////////////
// MODS LIST
//////////////////////////////////////////////////////

export function useMods(
  params?: GetModsParams
) {
  return useQuery({
    queryKey:
      queryKeys.mods.list(
        params
      ),

    queryFn: () =>
      getMods(params),
  });
}

//////////////////////////////////////////////////////
// MOD DETAIL
//////////////////////////////////////////////////////

export function useMod(
  slug: string
) {
  return useQuery({
    queryKey:
      queryKeys.mods.detail(
        slug
      ),

    queryFn: () =>
      getMod(slug),

    staleTime:
      1000 * 60 * 2,
  });
}