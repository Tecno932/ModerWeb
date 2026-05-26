import { Star } from "lucide-react";

import {
  useInteractions,
  useToggleFavorite,
} from "../hooks";

import styles from "./FavoriteButton.module.css";

type Props = {
  modId: number;
  slug: string;
};

export default function FavoriteButton({
  modId,
  slug,
}: Props) {
  const { data } =
    useInteractions(modId);

  const mutation =
    useToggleFavorite(
      modId,
      slug
    );

  const favorited =
    data?.favorited || false;

  const favorites =
    data?.favoritesCount || 0;

  return (
    <button
      className={`${styles.button} ${
        favorited
          ? styles.active
          : ""
      }`}
      onClick={() =>
        mutation.mutate()
      }
      disabled={
        mutation.isPending
      }
    >
      <Star size={16} />

      <span>{favorites}</span>
    </button>
  );
}