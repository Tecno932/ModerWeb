import LikeButton from "@/features/interactions/components/LikeButton";
import FavoriteButton from "@/features/interactions/components/FavoriteButton";

import { useState } from "react";
import {
  Share2,
  Download,
} from "lucide-react";

import styles from "./index.module.css";

type Props = {
  mod: any;
};

export default function ModSidebar({
  mod,
}: Props) {

  const handleShare = async () => {
    await navigator.clipboard.writeText(
      window.location.href
    );

    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  const [copied, setCopied] =
    useState(false);

  const latestVersion =
    mod.versions?.[0];

  const links = [
    {
      label: "Website",
      value: mod.links?.websiteUrl,
    },
    {
      label: "Discord",
      value: mod.links?.discordUrl,
    },
    {
      label: "Source",
      value: mod.links?.sourceUrl,
    },
    {
      label: "Issues",
      value: mod.links?.issuesUrl,
    },
    {
      label: "Wiki",
      value: mod.links?.wikiUrl,
    },
    {
      label: "Donate",
      value: mod.links?.donationUrl,
    },
  ].filter((link) => link.value);

  return (
    <aside className={styles.sidebar}>
      {/* ACTIONS */}

      <section className={styles.card}>
        <h3 className={styles.title}>
          Actions
        </h3>

        <div className={styles.actions}>
          <LikeButton
            modId={mod.id}
            slug={mod.slug}
          />

          <FavoriteButton
            modId={mod.id}
            slug={mod.slug}
          />

          <button
            onClick={handleShare}
            className={styles.iconButton}
          >
            {copied ? "✓" : <Share2 size={18} />}
          </button>

          <button
            className={styles.iconButton}
            onClick={() =>
              window.open(
                `${import.meta.env.VITE_API_URL}/versions/${latestVersion.id}/download`,
                "_blank"
              )
            }
          >
            <Download size={18} />
          </button>
        </div>
      </section>

      {/* DETAILS */}

      <section className={styles.card}>
        <h3 className={styles.title}>
          Details
        </h3>

        <div className={styles.info}>
          <div>
            <strong>
              Created
            </strong>

            <span>
              {new Date(
                mod.createdAt
              ).toLocaleDateString()}
            </span>
          </div>

          <div>
            <strong>
              Type
            </strong>

            <span>
              {mod.type}
            </span>
          </div>

          <div>
            <strong>
              Platform
            </strong>

            <span>
              {mod.platform}
            </span>
          </div>

          <div>
            <strong>
              Loader
            </strong>

            <span>
              {mod.loader || "-"}
            </span>
          </div>

          <div>
            <strong>
              License
            </strong>

            <span>
              {mod.license || "-"}
            </span>
          </div>
        </div>
      </section>

      {/* CATEGORIES */}

      <section className={styles.card}>
        <h3 className={styles.title}>
          Categories
        </h3>

        <div className={styles.tags}>
          {mod.categories?.length
            ? mod.categories.map(
                (
                  category: string
                ) => (
                  <span
                    key={category}
                    className={
                      styles.tag
                    }
                  >
                    {category}
                  </span>
                )
              )
            : "-"}
        </div>
      </section>

      {/* TAGS */}

      <section className={styles.card}>
        <h3 className={styles.title}>
          Tags
        </h3>

        <div className={styles.tags}>
          {mod.tags?.length
            ? mod.tags.map(
                (tag: any) => (
                  <span
                    key={tag.id}
                    className={
                      styles.tag
                    }
                  >
                    {tag.name}
                  </span>
                )
              )
            : "-"}
        </div>
      </section>

      {/* LINKS */}

      {links.length > 0 && (
        <section
          className={
            styles.card
          }
        >
          <h3
            className={
              styles.title
            }
          >
            Links
          </h3>

          <div
            className={
              styles.links
            }
          >
            {links.map(
              (link) => (
                <a
                  key={
                    link.label
                  }
                  href={
                    link.value
                  }
                  target="_blank"
                  rel="noreferrer"
                >
                  {
                    link.label
                  }
                </a>
              )
            )}
          </div>
        </section>
      )}
    </aside>
  );
}