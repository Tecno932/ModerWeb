import { Link } from "react-router-dom";

import Card from "@/shared/ui/card/Card";
import Badge from "@/shared/ui/badge/Badge";

import LikeButton from "@/features/interactions/components/LikeButton";
import FavoriteButton from "@/features/interactions/components/FavoriteButton";

import styles from "./ModCard.module.css";

type ModCardProps = {
  mod: any;
};

const API_URL =
  import.meta.env.VITE_API_URL;

export default function ModCard({
  mod,
}: ModCardProps) {
  const cover = mod.images?.find(
    (img: any) => img.isCover
  );

  return (
    <Card
      hoverable
      padding="sm"
      className={styles.card}
    >
      <Link
        to={`/mods/${mod.slug}`}
        className={styles.link}
      >
        //////////////////////////////////////////////////
        // IMAGE
        //////////////////////////////////////////////////

        <div className={styles.imageWrapper}>
          <img
            src={`${API_URL}${cover?.url}`}
            alt={mod.title}
            className={styles.image}
          />

          <div className={styles.overlay} />
        </div>

        //////////////////////////////////////////////////
        // CONTENT
        //////////////////////////////////////////////////

        <div className={styles.content}>
          ////////////////////////////////////////////////
          // HEADER
          ////////////////////////////////////////////////

          <div className={styles.header}>
            <h3 className={styles.title}>
              {mod.title}
            </h3>

            <div
              className={styles.author}
            >
              by{" "}
              {mod.author
                ?.username ||
                "Unknown"}
            </div>
          </div>

          ////////////////////////////////////////////////
          // DESCRIPTION
          ////////////////////////////////////////////////

          <p
            className={
              styles.description
            }
          >
            {mod.description}
          </p>

          ////////////////////////////////////////////////
          // TAGS
          ////////////////////////////////////////////////

          <div className={styles.tags}>
            {mod.tags
              ?.slice(0, 4)
              .map((tag: any) => (
                <Badge key={tag.name}>
                  {tag.name}
                </Badge>
              ))}
          </div>

          ////////////////////////////////////////////////
          // FOOTER
          ////////////////////////////////////////////////

          <div className={styles.footer}>
            ////////////////////////////////////////////
            // STATS
            ////////////////////////////////////////////

            <div
              className={styles.stats}
            >
              <span>
                ❤️{" "}
                {
                  mod.stats
                    ?.likes
                }
              </span>

              <span>
                👁{" "}
                {
                  mod.stats
                    ?.views
                }
              </span>

              <span>
                ⬇️{" "}
                {
                  mod.stats
                    ?.downloads
                }
              </span>
            </div>

            ////////////////////////////////////////////
            // ACTIONS
            ////////////////////////////////////////////

            <div
              className={
                styles.actions
              }
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
        </div>
      </Link>
    </Card>
  );
}