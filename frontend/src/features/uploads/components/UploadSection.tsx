import UploadItem from "./UploadItem";

import type {
  UploadItem as UploadItemType,
} from "../store/upload.store";

type Props = {
  title: string;

  uploads: UploadItemType[];

  onCancel: (
    id: string
  ) => void;

  onRetry: (
    id: string
  ) => void;
};

export default function UploadSection({
  title,
  uploads,
  onCancel,
  onRetry,
}: Props) {
  //////////////////////////////////////////////////////
  // EMPTY
  //////////////////////////////////////////////////////

  if (!uploads.length) {
    return null;
  }

  //////////////////////////////////////////////////////
  // UI
  //////////////////////////////////////////////////////

  return (
    <div
      style={{
        marginBottom: 20,
      }}
    >
      <h4
        style={{
          marginBottom: 10,

          opacity: 0.8,
        }}
      >
        {title}
      </h4>

      <div
        style={{
          display: "flex",

          flexDirection:
            "column",

          gap: 12,
        }}
      >
        {uploads.map((upload) => (
          <UploadItem
            key={upload.id}

            upload={upload}

            onCancel={
              onCancel
            }

            onRetry={
              onRetry
            }
          />
        ))}
      </div>
    </div>
  );
}