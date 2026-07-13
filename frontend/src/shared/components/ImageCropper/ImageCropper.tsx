import { useCallback, useState, } from "react";
import Cropper, { type Area, } from "react-easy-crop";
import cropImage from "@/shared/utils/cropImage";

import styles from "./ImageCropper.module.css";

interface Props {
  image: string;

  open: boolean;

  aspect: number;

  cropShape?: "rect" | "round";

  onCancel: () => void;

  onSave: (
    croppedBlob: Blob
  ) => void | Promise<void>;
}

export default function ImageCropper({
  image,
  open,
  aspect,
  cropShape = "rect",
  onCancel,
  onSave,
}: Props) {

  const [crop, setCrop] =
    useState({
      x: 0,
      y: 0,
    });
    

  const [zoom, setZoom] =
    useState(1);

  const [croppedAreaPixels, setCroppedAreaPixels] =
    useState<Area>();

  const handleCropComplete =
    useCallback(
      (
        _: Area,
        croppedPixels: Area
      ) => {
        setCroppedAreaPixels(
          croppedPixels
        );
      },
      []
    );

  if (!open) {
    return null;
  }

  return (
    <div className={styles.backdrop}>
      <div className={styles.modal}>
        <div className={styles.cropperContainer}>

        <Cropper
            style={{containerStyle:{padding:"20px"}}}
            image={image}
            crop={crop}
            zoom={zoom}
            aspect={aspect}
            cropShape={cropShape}
            keyboardStep={4}

            restrictPosition={true}
            initialCroppedAreaPercentages={undefined}

            zoomWithScroll

            minZoom={1}
            maxZoom={4}
            zoomSpeed={0.2}

            objectFit="contain"

            showGrid={false}

            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={handleCropComplete}
        />

        </div>

        <div className={styles.controls}>

          <label
            className={styles.zoomLabel}
          >
            Zoom

            <input
              className={styles.slider}
              type="range"
              min={1}
              max={3}
              step={0.05}
              value={zoom}
              onChange={(e) =>
                setZoom(
                  Number(
                    e.target.value
                  )
                )
              }
            />

          </label>

          <div className={styles.buttons}>

            <button
              type="button"
              className={styles.cancel}
              onClick={onCancel}
            >
              Cancelar
            </button>

            <button
              type="button"
              className={styles.save}
              onClick={async () => {

                if (!croppedAreaPixels) {
                  return;
                }

                const blob =
                  await cropImage(
                    image,
                    croppedAreaPixels
                  );

                await onSave(blob);

              }}
            >
              Guardar
            </button>
          </div>
        </div>
      </div>
    </div>
  );

}