import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createMod } from "../mods/api";

export function useCreateMod() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: createMod,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["mods"] });
    },
  });
}