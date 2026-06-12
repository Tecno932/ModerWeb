export const queryKeys = {
  mods: {
    all: ["mods"] as const,

    lists: () =>
      [...queryKeys.mods.all, "list"] as const,

    list: (params?: any) => [
      "mods",
      params,
    ],

    detail: (slug: string) => [
      "mod",
      slug,
    ],

    interactions: (
      modId: number
    ) => [
      "mod-interactions",
      modId,
    ],
  },

  comments: {
    byMod: (
      modId: number
    ) => [
      "comments",
      modId,
    ],
  },
};