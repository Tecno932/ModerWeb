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

export async function cropImage(
  imageSrc: string,
  crop: Area,
  fileName: string = "image.webp"
): Promise<File> {

  const image =
    await createImage(imageSrc);

  const canvas =
    document.createElement("canvas");

  const ctx =
    canvas.getContext("2d");

  if (!ctx) {
    throw new Error(
      "No se pudo crear el canvas."
    );
  }

  canvas.width =
    crop.width;

  canvas.height =
    crop.height;

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

  const blob =
    await new Promise<Blob>(
      (resolve, reject) => {

        canvas.toBlob(
          (blob) => {

            if (!blob) {
              reject(
                new Error(
                  "No se pudo generar la imagen."
                )
              );
              return;
            }

            resolve(blob);

          },
          "image/webp",
          0.92
        );

      }
    );

  return new File(
    [blob],
    fileName,
    {
      type: "image/webp",
    }
  );

}