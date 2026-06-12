import { Link } from "react-router-dom";

import {
  Download,
  Heart,
  Star,
  ClockFading,
} from "lucide-react";

import styles from "./ModCard.module.css";

type Props = {
  mod: any;
};

const API_URL =
  import.meta.env.VITE_API_URL;

export default function ModCard({
  mod,
}: Props) {
  const icon =
    mod.icon
      ? `${API_URL}${mod.icon}`
      : "/placeholder.png";

  return (
    <article className={styles.card}>
      <Link
        to={`/mods/${mod.slug}`}
        className={styles.link}
      >
        {/* ICON */}

        <img
          src={icon}
          alt={mod.title}
          className={styles.icon}
        />

        {/* CONTENT */}

        <div className={styles.content}>
          <div className={styles.top}>
            <div>
              <h3 className={styles.title}>
                {mod.title}
              </h3>

              {/* SUMMARY */}

              <p className={styles.summary}>
                {mod.summary ||
                  mod.description}
              </p>
            </div>

            <div className={styles.rightColumn}>
              <div className={styles.actions}>
                <div className={styles.statButton}>
                  <Download size={16} />
                  <span>{mod.downloads}</span>
                </div>

                <div className={styles.statButton}>
                  <Heart size={16} />
                  <span>{mod.likesCount}</span>
                </div>

                <div className={styles.statButton}>
                  <Star size={16} />
                  <span>{mod.favoritesCount}</span>
                </div>
              </div>

              <div className={styles.date}>
                <ClockFading size={14} />

                <span>
                  {new Date(
                    mod.createdAt
                  ).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>

          {/* BADGES */}

          <div className={styles.badges}>
            <span
              className={
                styles.badge
              }
            >
              {mod.type}
            </span>

            <span
              className={
                styles.badge
              }
            >
              {mod.platform}
            </span>

            {mod.loader && (
              <span
                className={
                  styles.badge
                }
              >
                {mod.loader}
              </span>
            )}
          </div>
        </div>
      </Link>
    </article>
  );
}