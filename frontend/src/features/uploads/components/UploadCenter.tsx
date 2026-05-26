import { useState } from "react";

import {
  useUploadStore,
} from "../store/upload.store";

import UploadSection from "./UploadSection";

export default function UploadCenter() {
  //////////////////////////////////////////////////////
  // STORE
  //////////////////////////////////////////////////////

  const uploads =
    useUploadStore(
      (s) => s.uploads
    );

  const cancelUpload =
    useUploadStore(
      (s) => s.cancelUpload
    );

  const retryUpload =
    useUploadStore(
      (s) => s.retryUpload
    );

  //////////////////////////////////////////////////////
  // UI STATE
  //////////////////////////////////////////////////////

  const [minimized, setMinimized] =
    useState(false);

  //////////////////////////////////////////////////////
  // EMPTY
  //////////////////////////////////////////////////////

  if (!uploads.length) {
    return null;
  }

  //////////////////////////////////////////////////////
  // GROUPS
  //////////////////////////////////////////////////////

  const uploading =
    uploads.filter(
      (u) =>
        u.status ===
          "uploading" ||
        u.status === "queued"
    );

  const completed =
    uploads.filter(
      (u) =>
        u.status === "done"
    );

  const failed =
    uploads.filter(
      (u) =>
        u.status === "error" ||
        u.status ===
          "cancelled"
    );

  //////////////////////////////////////////////////////
  // ACTIVE COUNT
  //////////////////////////////////////////////////////

  const activeCount =
    uploading.length;

  //////////////////////////////////////////////////////
  // UI
  //////////////////////////////////////////////////////

  return (
    <div
      style={{
        position: "fixed",

        right: 20,

        bottom: 20,

        width: 380,

        background: "#111",

        border:
          "1px solid #333",

        borderRadius: 18,

        padding: 16,

        zIndex: 9999,

        boxShadow:
          "0 10px 30px rgba(0,0,0,0.4)",
      }}
    >
      ////////////////////////////////////////////////////
      // HEADER
      ////////////////////////////////////////////////////

      <button
        onClick={() =>
          setMinimized(
            !minimized
          )
        }

        style={{
          width: "100%",

          background:
            "transparent",

          border: "none",

          color: "white",

          cursor: "pointer",

          display: "flex",

          justifyContent:
            "space-between",

          alignItems: "center",

          marginBottom:
            minimized
              ? 0
              : 16,
        }}
      >
        <h3
          style={{
            margin: 0,
          }}
        >
          Uploads
        </h3>

        <div>
          {activeCount} active{" "}

          {minimized
            ? "▲"
            : "▼"}
        </div>
      </button>

      ////////////////////////////////////////////////////
      // COLLAPSED
      ////////////////////////////////////////////////////

      {!minimized && (
        <div
          style={{
            maxHeight: 500,

            overflowY: "auto",

            paddingRight: 4,
          }}
        >
          <UploadSection
            title="⬆ Uploading"

            uploads={
              uploading
            }

            onCancel={
              cancelUpload
            }

            onRetry={
              retryUpload
            }
          />

          <UploadSection
            title="✅ Completed"

            uploads={
              completed
            }

            onCancel={
              cancelUpload
            }

            onRetry={
              retryUpload
            }
          />

          <UploadSection
            title="❌ Failed"

            uploads={failed}

            onCancel={
              cancelUpload
            }

            onRetry={
              retryUpload
            }
          />
        </div>
      )}
    </div>
  );
}