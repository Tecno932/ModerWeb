export const authUserSelect = {
  id: true,

  username: true,
  email: true,

  role: true,

  isVerified: true,

  createdAt: true,
  updatedAt: true,

  lastLoginAt: true,

  profile: {
    select: {
      displayName: true,

      avatarUrl: true,
      bannerUrl: true,

      bio: true,

      accentColor: true,
    },
  },
} as const;