import { Link } from "react-router-dom";

import {
  Download,
  Heart,
  Eye,
} from "lucide-react";

import LikeButton from "@/features/interactions/components/LikeButton";
import FavoriteButton from "@/features/interactions/components/FavoriteButton";

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

              <p className={styles.author}>
                by{" "}
                {mod.author?.username ||
                  "Unknown"}
              </p>
            </div>

            <div
              className={styles.actions}
              onClick={(e) =>
                e.preventDefault()
              }
            >
              <LikeButton
                modId={mod.id}
                slug={mod.slug}
              />

              <FavoriteButton
                modId={mod.id}
                slug={mod.slug}
              />
            </div>
          </div>

          {/* SUMMARY */}

          <p className={styles.summary}>
            {mod.summary ||
              mod.description}
          </p>

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

          {/* FOOTER */}

          <div className={styles.footer}>
            <div
              className={styles.stats}
            >
              <span>
                <Download
                  size={14}
                />

                {
                  mod.downloads
                }
              </span>

              <span>
                <Heart
                  size={14}
                />

                {
                  mod.likesCount
                }
              </span>

              <span>
                <Eye size={14} />

                {mod.views}
              </span>
            </div>

            <div
              className={
                styles.updated
              }
            >
              {new Date(
                mod.updatedAt
              ).toLocaleDateString()}
            </div>
          </div>
        </div>
      </Link>
    </article>
  );
}