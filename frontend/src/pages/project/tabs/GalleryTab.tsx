import { useState } from "react";

import {
  GripVertical,
  ImagePlus,
  Trash2,
} from "lucide-react";

import Button from "@/shared/ui/button/Button";

import Section from "@/shared/ui/section/Section";

import styles from "./GalleryTab.module.css";

const mockImages = [
  {
    id: 1,
    url: "https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=1200",
  },

  {
    id: 2,
    url: "https://images.unsplash.com/photo-1542751110-97427bbecf20?q=80&w=1200",
  },

  {
    id: 3,
    url: "https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?q=80&w=1200",
  },

  {
    id: 4,
    url: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1200",
  },
];

export default function GalleryTab() {
  //////////////////////////////////////////////////
  // STATE
  //////////////////////////////////////////////////

  const [images, setImages] =
    useState(mockImages);

  //////////////////////////////////////////////////
  // DELETE
  //////////////////////////////////////////////////

  const handleDelete = (
    id: number
  ) => {
    setImages((prev) =>
      prev.filter(
        (image) =>
          image.id !== id
      )
    );
  };

  //////////////////////////////////////////////////
  // RENDER
  //////////////////////////////////////////////////

  return (
    <div className={styles.page}>
      {/* UPLOAD */}
      <Section
        title="Gallery"
        description="Upload screenshots, promotional banners and showcase images."
      >
        <div className={styles.uploadBox}>
          <ImagePlus size={42} />

          <h3>
            Upload Images
          </h3>

          <p>
            Drag & drop images or
            upload manually.
          </p>

          <Button variant="secondary">
            Choose Images
          </Button>
        </div>
      </Section>

      {/* GRID */}
      <div className={styles.grid}>
        {images.map((image) => (
          <div
            key={image.id}
            className={styles.card}
          >
            {/* IMAGE */}
            <img
              src={image.url}
              alt=""
              className={styles.image}
            />

            {/* OVERLAY */}
            <div
              className={
                styles.overlay
              }
            >
              <button
                className={
                  styles.dragButton
                }
              >
                <GripVertical
                  size={18}
                />
              </button>

              <button
                className={
                  styles.deleteButton
                }
                onClick={() =>
                  handleDelete(
                    image.id
                  )
                }
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}