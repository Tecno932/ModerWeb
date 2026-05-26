import { Heart } from "lucide-react";

import {
  useInteractions,
  useToggleLike,
} from "../hooks";

import styles from "./LikeButton.module.css";

type Props = {
  modId: number;
  slug: string;
};

export default function LikeButton({
  modId,
  slug,
}: Props) {
  const { data } =
    useInteractions(modId);

  const mutation =
    useToggleLike(
      modId,
      slug
    );

  const liked =
    data?.liked || false;

  const likes =
    data?.likesCount || 0;

  return (
    <button
      className={`${styles.button} ${
        liked ? styles.active : ""
      }`}
      onClick={() =>
        mutation.mutate()
      }
      disabled={
        mutation.isPending
      }
    >
      <Heart size={16} />

      <span>{likes}</span>
    </button>
  );
}