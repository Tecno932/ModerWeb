import { useState, useEffect } from "react";
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

  const [localLiked, setLocalLiked] =
    useState(liked);

  const [localLikes, setLocalLikes] =
    useState(likes);

  useEffect(() => {
    setLocalLiked(liked);
    setLocalLikes(likes);
  }, [liked, likes]);

  return (
    <button
      className={`${styles.button} ${
        localLiked
          ? styles.active
          : ""
      }`}
      onClick={() => {
        setLocalLiked(
          !localLiked
        );

        setLocalLikes(
          localLiked
            ? localLikes - 1
            : localLikes + 1
        );

        mutation.mutate();
      }}
      disabled={
        mutation.isPending
      }
    >
      <Heart
        size={18}
        strokeWidth={2.2}
      />

      <span>{localLikes}</span>
    </button>
  );
}