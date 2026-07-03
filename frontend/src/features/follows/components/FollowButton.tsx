import { useFollow } from "../hooks/useFollow";
import { useUnfollow } from "../hooks/useUnfollow";

import styles from "./FollowButton.module.css";

interface Props {
  username: string;

  isFollowing: boolean;
}

export default function FollowButton({
  username,
  isFollowing,
}: Props) {
  const follow =
    useFollow();

  const unfollow =
    useUnfollow();

  const loading =
    follow.isPending ||
    unfollow.isPending;

  async function handleClick() {
    if (loading) {
      return;
    }

    if (isFollowing) {
      await unfollow.mutateAsync(
        username
      );
    } else {
      await follow.mutateAsync(
        username
      );
    }
  }

  return (
    <button
      className={`${styles.button} ${
        isFollowing ? styles.following : styles.follow
      }`}
      onClick={handleClick}
      disabled={loading}
    >
      {loading
        ? "..."
        : isFollowing
          ? "Siguiendo"
          : "Seguir"}
    </button>
  );
}