import { useRef, useState } from "react";

import { uploadImage } from "@/features/uploads/api/uploadImage";
import ImageCropper from "../ImageCropper/ImageCropper";
import Spinner from "@/shared/ui/Spinner/Spinner";

import styles from "./ImageUploader.module.css";

type Props = {
  folder: "avatars" | "banners";
  accept?: string;
  className?: string;
  onChange: (url: string) => void;
  children?: React.ReactNode;
};

export default function ImageUploader({
  folder,
  accept = ".png,.jpg,.jpeg,.webp",
  className,
  onChange,
  children,
}: Props) {

  const [selectedImage, setSelectedImage] = useState("");
  const [cropOpen, setCropOpen] = useState(false);

  const [selectedFile, setSelectedFile] =
    useState<File | null>(null);

  const inputRef =
    useRef<HTMLInputElement>(null);

  const [uploading, setUploading] =
    useState(false);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement>
  ) {

    const file = e.target.files?.[0];

    if (!file) return;

    setSelectedFile(file);

    setSelectedImage(
      URL.createObjectURL(file)
    );

    setCropOpen(true);

    e.target.value = "";
  }

  async function handleCropComplete(
    croppedBlob: Blob
  ) {

    if (!selectedFile) return;

    try {

      // cerrar inmediatamente
      setCropOpen(false);

      setUploading(true);

      const croppedFile = new File(
        [croppedBlob],
        selectedFile.name,
        {
          type: "image/webp",
        }
      );

      const url =
        await uploadImage(
          croppedFile,
          folder
        );

      onChange(url);

    }
    finally {

      URL.revokeObjectURL(selectedImage);

      setSelectedImage("");

      setSelectedFile(null);

      setUploading(false);

    }

  }

  return (
  <>
    <div
      className={`${styles.root} ${className ?? ""}`}
      onClick={() => {
        if (!uploading) {
          inputRef.current?.click();
        }
      }}
    >

      <input
        ref={inputRef}
        className={styles.input}
        type="file"
        accept={accept}
        onChange={handleChange}
      />

      {children}

      {uploading && (
        <div className={styles.overlay}>
          <Spinner />
          <span className={styles.text}>
            ...
          </span>
        </div>
      )}

    </div>
    
    <ImageCropper
      open={cropOpen}
      image={selectedImage}
      aspect={
        folder === "avatars"
          ? 1
          : 3 / 1
      }
      onCancel={() => {
        URL.revokeObjectURL(selectedImage);

        setCropOpen(false);
        setSelectedImage("");
        setSelectedFile(null);
      }}

      onSave={handleCropComplete}
    />
  </>
  );
}