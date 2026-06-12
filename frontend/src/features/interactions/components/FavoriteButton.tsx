import { useEffect, useState } from "react";
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

  const [localFavorited, setLocalFavorited] =
    useState(favorited);

  const [localFavorites, setLocalFavorites] =
    useState(favorites);

  //////////////////////////////////////////////////////
  // SINCRONIZAR CON EL SERVIDOR
  //////////////////////////////////////////////////////

  useEffect(() => {
    setLocalFavorited(favorited);
    setLocalFavorites(favorites);
  }, [favorited, favorites]);

  //////////////////////////////////////////////////////
  // TOGGLE
  //////////////////////////////////////////////////////

  const handleClick = () => {
    const nextState =
      !localFavorited;

    setLocalFavorited(nextState);

    setLocalFavorites((prev) =>
      nextState
        ? prev + 1
        : Math.max(0, prev - 1)
    );

    mutation.mutate(undefined, {
      onError: () => {
        setLocalFavorited(
          !nextState
        );

        setLocalFavorites(
          localFavorites
        );
      },
    });
  };

  return (
    <button
      className={`${styles.button} ${
        localFavorited
          ? styles.active
          : ""
      }`}
      onClick={handleClick}
      disabled={
        mutation.isPending
      }
    >
      <Star
        size={18}
        strokeWidth={2.2}
        fill={
          localFavorited
            ? "currentColor"
            : "none"
        }
      />

      <span>
        {localFavorites}
      </span>
    </button>
  );
}