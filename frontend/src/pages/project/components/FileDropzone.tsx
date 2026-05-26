import { useUploadStore } from "@/features/uploads/store/upload.store";

export default function FileDropzone({
  versionId,
}: {
  versionId: number;
}) {
  const addFiles = useUploadStore(
    (s) => s.addFiles
  );

  //////////////////////////////////////////////////////
  // DROP
  //////////////////////////////////////////////////////

  const handleDrop = (
    e: React.DragEvent
  ) => {
    e.preventDefault();

    const files = Array.from(
      e.dataTransfer.files
    );

    addFiles(versionId, files);
  };

  //////////////////////////////////////////////////////
  // INPUT
  //////////////////////////////////////////////////////

  const handleInput = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = Array.from(
      e.target.files || []
    );

    addFiles(versionId, files);
  };

  //////////////////////////////////////////////////////
  // UI
  //////////////////////////////////////////////////////

  return (
    <label
      onDrop={handleDrop}
      onDragOver={(e) =>
        e.preventDefault()
      }
      style={{
        border: "2px dashed #555",
        borderRadius: 16,
        padding: 50,
        display: "block",
        cursor: "pointer",
        textAlign: "center",
      }}
    >
      <input
        hidden
        multiple
        type="file"
        onChange={handleInput}
      />

      <h3>
        Drag & Drop mods aquí 🚀
      </h3>

      <p>
        o hacé click para subir
      </p>

      <small>
        soporta .jar y .zip
      </small>
    </label>
  );
}