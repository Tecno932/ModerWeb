export function mapCommentUser<
  T extends {
    user: {
      profile?: {
        avatarUrl: string | null;
      } | null;
    };
  }
>(comment: T) {
  return {
    ...comment,
    user: {
      ...comment.user,
      avatar:
        comment.user.profile?.avatarUrl ??
        null,
    },
  };
}