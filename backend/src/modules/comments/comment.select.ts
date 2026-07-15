export const commentUserSelect = {
  id: true,
  username: true,
  profile: {
    select: {
      avatarUrl: true,
    },
  },
} as const;