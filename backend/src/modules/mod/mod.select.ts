export const modAuthorSelect = {
  id: true,
  username: true,
  profile: {
    select: {
      avatarUrl: true,
    },
  },
} as const;

export const modListInclude = {
  images: true,

  tags: {
    include: {
      tag: true,
    },
  },

  author: {
    select: modAuthorSelect,
  },
} as const;

export const modDetailInclude = {
  ...modListInclude,

  versions: {
    include: {
      files: true,
    },

    orderBy: {
      createdAt: "desc",
    },
  },

  _count: {
    select: {
      comments: {
        where: {
          deleted: false,
        },
      },
    },
  },
} as const;