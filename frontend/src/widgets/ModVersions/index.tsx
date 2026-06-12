import styles from "./index.module.css";

import EmptyState from "@/shared/ui/EmptyState";

import {
  getVersionDownloadUrl,
} from "@/features/versions/api";

type Props = {
  versions: any[];
  modId: number;
  isOwner?: boolean;
};

export default function VersionsTable({
  versions,
}: Props) {
  if (!versions?.length) {
    return (
      <EmptyState message="No versions yet" />
    );
  }

  return (
    <div className={styles.list}>
      {versions.map((v) => {
        const file = v.files?.[0];

        return (
          <div
            key={v.id}
            className={styles.card}
          >
            <div className={styles.left}>
              <h3>
                {v.version}
              </h3>

              <div
                className={
                  styles.meta
                }
              >
                <span>
                  {file?.releaseType ||
                    "Release"}
                </span>

                <span>
                  Minecraft{" "}
                  {v.minecraftVersion ||
                    "-"}
                </span>

                <span>
                  {v.loader ||
                    "-"}
                </span>
              </div>
            </div>

            <div
              className={
                styles.stats
              }
            >
              <div>
                <small>
                  Published
                </small>

                <span>
                  {new Date(
                    v.createdAt
                  ).toLocaleDateString()}
                </span>
              </div>

              <div>
                <small>
                  Downloads
                </small>

                <span>
                  {file?.downloads ||
                    0}
                </span>
              </div>

              <div>
                <small>
                  Size
                </small>

                <span>
                  {file
                    ? `${(
                        file.size /
                        1024 /
                        1024
                      ).toFixed(
                        2
                      )} MB`
                    : "-"}
                </span>
              </div>
            </div>

            <button
              className={
                styles.download
              }
              onClick={() =>
                window.open(
                  getVersionDownloadUrl(
                    v.id
                  ),
                  "_blank"
                )
              }
            >
              ⬇ Download
            </button>
          </div>
        );
      })}
    </div>
  );
}