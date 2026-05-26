import { Link } from "react-router-dom";

import styles from "./SearchResultCard.module.css";

type Props = {
  mod: any;
};

export default function SearchResultCard({
  mod,
}: Props) {
  const cover = mod.images?.find(
    (img: any) => img.isCover
  );

  return (
    <Link
      to={`/mods/${mod.slug}`}
      className={styles.card}
    >
      {/* IMAGE */}

      <img
        src={`http://192.168.0.110:3000${cover?.url}`}
        alt={mod.title}
        className={styles.image}
      />

      {/* CONTENT */}

      <div className={styles.content}>
        <div className={styles.top}>
          <h4 className={styles.title}>
            {mod.title}
          </h4>

          <span className={styles.downloads}>
            ⬇ {mod.stats?.downloads || 0}
          </span>
        </div>

        <p className={styles.description}>
          {mod.description}
        </p>

        <div className={styles.bottom}>
          <span>
            ❤️ {mod.stats?.likes || 0}
          </span>

          <span>
            👁 {mod.stats?.views || 0}
          </span>

          <span className={styles.author}>
            by{" "}
            {mod.author?.username ||
              "Unknown"}
          </span>
        </div>
      </div>
    </Link>
  );
}