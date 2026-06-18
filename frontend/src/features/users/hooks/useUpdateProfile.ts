import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { updateProfile }
  from "../api";

export function useUpdateProfile(
  token: string
) {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: (
      data: {
        username?: string;
        bio?: string;
      }
    ) =>
      updateProfile(
        token,
        data
      ),

    onSuccess: () => {
      //////////////////////////////////////////////////
      // REFRESH USER
      //////////////////////////////////////////////////

      queryClient.invalidateQueries({
        queryKey: ["me"],
      });

      //////////////////////////////////////////////////
      // REFRESH PROFILES
      //////////////////////////////////////////////////

      queryClient.invalidateQueries({
        queryKey: ["profile"],
      });
    },
  });
}