import { useState } from "react";

import styles from "./index.module.css";

import EmptyState from "@/shared/ui/EmptyState";

import {
  getVersionDownloadUrl,
} from "@/features/versions/api";

import {
  useDeleteVersion,
  useUpdateVersion,
} from "@/features/upload-version/hooks";

import type {
  Version,
} from "@/features/versions/api";

type Props = {
  versions: Version[];

  modId: string | number;

  isOwner?: boolean;
};

export default function VersionsTable({
  versions,
  modId,
  isOwner,
}: Props) {
  //////////////////////////////////////////////////////
  // STATE
  //////////////////////////////////////////////////////

  const [openMenu, setOpenMenu] =
    useState<number | null>(
      null
    );

  //////////////////////////////////////////////////////
  // MUTATIONS
  //////////////////////////////////////////////////////

  const {
    mutateAsync:
      deleteVersionMutation,
  } = useDeleteVersion(modId);

  const {
    mutateAsync:
      updateVersionMutation,
  } = useUpdateVersion(modId);

  //////////////////////////////////////////////////////
  // EMPTY
  //////////////////////////////////////////////////////

  if (!versions?.length) {
    return (
      <EmptyState message="No versions yet" />
    );
  }

  //////////////////////////////////////////////////////
  // DOWNLOAD
  //////////////////////////////////////////////////////

  const handleDownload = (
    versionId: number
  ) => {
    window.open(
      getVersionDownloadUrl(
        versionId
      ),
      "_blank"
    );
  };

  //////////////////////////////////////////////////////
  // DELETE
  //////////////////////////////////////////////////////

  const handleDelete = async (
    versionId: number
  ) => {
    const confirmed =
      confirm(
        "Delete version?"
      );

    if (!confirmed) return;

    try {
      await deleteVersionMutation(
        versionId
      );

      setOpenMenu(null);

    } catch (err) {
      console.error(err);

      alert(
        "Error deleting version"
      );
    }
  };

  //////////////////////////////////////////////////////
  // EDIT
  //////////////////////////////////////////////////////

  const handleEdit = async (
    version: Version
  ) => {
    const name = prompt(
      "New version name",
      version.version
    );

    if (!name) return;

    try {
      await updateVersionMutation({
        versionId:
          version.id,

        version: name,
      });

      setOpenMenu(null);

    } catch (err) {
      console.error(err);

      alert(
        "Error editing version"
      );
    }
  };

  //////////////////////////////////////////////////////
  // UI
  //////////////////////////////////////////////////////

  return (
    <div className={styles.wrapper}>
      <h3>Versions</h3>

      <table className={styles.table}>
        <thead>
          <tr>
            <th>Type</th>

            <th>Version</th>

            <th>Minecraft</th>

            <th>Loader</th>

            <th>Size</th>

            <th>Downloads</th>

            <th>Date</th>

            <th>Download</th>

            {isOwner && <th>⋯</th>}
          </tr>
        </thead>

        <tbody>
          {versions.map((v) => {
            const primaryFile = v.files?.[0];

            return (
              <tr key={v.id}>
                <td>
                  {primaryFile?.releaseType ||
                    "release"}
                </td>

                <td>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                    }}
                  >
                    <span>
                      {v.version}
                    </span>

                    {v.isUploading && (
                      <span
                        style={{
                          fontSize: 11,
                          padding: "2px 6px",
                          borderRadius: 999,
                          background:
                            "#1677ff",
                        }}
                      >
                        Uploading...
                      </span>
                    )}
                  </div>
                </td>

                <td>
                  {v.minecraftVersion ||
                    "-"}
                </td>

                <td>
                  {v.loader || "-"}
                </td>

                <td>
                  {primaryFile
                    ? `${(
                        primaryFile.size /
                        1024 /
                        1024
                      ).toFixed(2)} MB`
                    : "-"}
                </td>

                <td>
                  {primaryFile?.downloads ||
                    0}
                </td>

                <td>
                  {v.createdAt
                    ? new Date(
                        v.createdAt
                      ).toLocaleDateString()
                    : "-"}
                </td>

                <td>
                  {primaryFile ? (
                    <button
                      onClick={() =>
                        handleDownload(
                          v.id
                        )
                      }
                    >
                      ⬇
                    </button>
                  ) : (
                    "-"
                  )}
                </td>

                {isOwner && (
                  <td
                    style={{
                      position:
                        "relative",
                    }}
                  >
                    <button
                      onClick={() =>
                        setOpenMenu(
                          openMenu === v.id
                            ? null
                            : v.id
                        )
                      }
                    >
                      ⋯
                    </button>

                    {openMenu ===
                      v.id && (
                      <div
                        style={{
                          position:
                            "absolute",

                          right: 0,

                          background:
                            "#222",

                          padding: 8,

                          borderRadius: 8,

                          display: "flex",

                          flexDirection:
                            "column",

                          gap: 6,

                          zIndex: 20,

                          minWidth: 120,
                        }}
                      >
                        <button
                          onClick={() =>
                            handleEdit(v)
                          }
                        >
                          ✏️ Edit
                        </button>

                        <button
                          onClick={() =>
                            handleDelete(
                              v.id
                            )
                          }
                        >
                          🗑 Delete
                        </button>
                      </div>
                    )}
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}