import type { Area } from "react-easy-crop";

function createImage(
  url: string
): Promise<HTMLImageElement> {

  return new Promise(
    (resolve, reject) => {

      const image = new Image();

      image.crossOrigin = "anonymous";

      image.onload = () =>
        resolve(image);

      image.onerror = reject;

      image.src = url;

    }
  );

}

export default async function cropImage(
  imageSrc: string,
  crop: Area
): Promise<Blob> {

  const image =
    await createImage(imageSrc);

  const canvas =
    document.createElement("canvas");

  canvas.width =
    crop.width;

  canvas.height =
    crop.height;

  const ctx =
    canvas.getContext("2d");

  if (!ctx) {
    throw new Error(
      "No se pudo crear el canvas."
    );
  }

  ctx.drawImage(
    image,

    crop.x,
    crop.y,
    crop.width,
    crop.height,

    0,
    0,
    crop.width,
    crop.height
  );

  return new Promise(
    (resolve, reject) => {

      canvas.toBlob(

        (blob) => {

          if (!blob) {

            reject(
              new Error(
                "No se pudo generar el Blob."
              )
            );

            return;
          }

          resolve(blob);

        },

        "image/webp",
        0.95
      );

    }
  );

}