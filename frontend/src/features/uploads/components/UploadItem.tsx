import type {
  UploadItem as UploadItemType,
} from "@/features/uploads/store/upload.store";

type Props = {
  upload: UploadItemType;

  onCancel: (
    id: string
  ) => void;

  onRetry: (
    id: string
  ) => void;
};

export default function UploadItem({
  upload,
  onCancel,
  onRetry,
}: Props) {
  //////////////////////////////////////////////////////
  // COLORS
  //////////////////////////////////////////////////////

  const progressColor =
    upload.status === "error"
      ? "#ff4d4f"
      : upload.status === "done"
      ? "#52c41a"
      : upload.status ===
        "cancelled"
      ? "#666"
      : "#1677ff";

  //////////////////////////////////////////////////////
  // UI
  //////////////////////////////////////////////////////

  return (
    <div
      style={{
        opacity:
          upload.isRemoving
            ? 0
            : 1,

        transform:
          upload.isRemoving
            ? "translateY(10px)"
            : "translateY(0)",

        transition:
          "all 0.3s ease",

        background: "#181818",

        border:
          "1px solid #2a2a2a",

        borderRadius: 14,

        padding: 12,

        marginBottom: 12,
      }}
    >
      ////////////////////////////////////////////////////
      // HEADER
      ////////////////////////////////////////////////////

      <div
        style={{
          display: "flex",

          justifyContent:
            "space-between",

          gap: 12,
        }}
      >
        <span
          style={{
            maxWidth: 220,

            overflow: "hidden",

            textOverflow:
              "ellipsis",

            whiteSpace: "nowrap",

            fontSize: 14,
          }}
        >
          {upload.filename}
        </span>

        <span
          style={{
            fontSize: 13,

            opacity: 0.7,
          }}
        >
          {upload.progress}%
        </span>
      </div>

      ////////////////////////////////////////////////////
      // PROGRESS BAR
      ////////////////////////////////////////////////////

      <div
        style={{
          height: 8,

          background: "#222",

          borderRadius: 999,

          overflow: "hidden",

          marginTop: 8,
        }}
      >
        <div
          style={{
            width: `${upload.progress}%`,

            height: "100%",

            transition:
              "width 0.2s ease",

            background:
              progressColor,
          }}
        />
      </div>

      ////////////////////////////////////////////////////
      // FOOTER
      ////////////////////////////////////////////////////

      <div
        style={{
          display: "flex",

          justifyContent:
            "space-between",

          alignItems: "center",

          marginTop: 8,
        }}
      >
        <small
          style={{
            opacity: 0.7,

            textTransform:
              "capitalize",
          }}
        >
          {upload.status}
        </small>

        <div
          style={{
            display: "flex",

            gap: 8,
          }}
        >
          {upload.status ===
            "uploading" && (
            <button
              onClick={() =>
                onCancel(
                  upload.id
                )
              }
            >
              Cancel
            </button>
          )}

          {(upload.status ===
            "error" ||
            upload.status ===
              "cancelled") && (
            <button
              onClick={() =>
                onRetry(
                  upload.id
                )
              }
            >
              Retry
            </button>
          )}
        </div>
      </div>

      ////////////////////////////////////////////////////
      // ERROR
      ////////////////////////////////////////////////////

      {upload.error && (
        <div
          style={{
            marginTop: 8,

            color: "#ff4d4f",

            fontSize: 12,
          }}
        >
          {upload.error}
        </div>
      )}
    </div>
  );
}