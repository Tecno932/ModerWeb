export type UploadProgressCallback = (progress: number) => void;

export type UploadTask = {
  promise: Promise<any>;
  cancel: () => void;
};

type UploadFileOptions = {
  versionId: number;
  file: File;
  onProgress?: UploadProgressCallback;
};

export function uploadVersionFile({
  versionId,
  file,
  onProgress,
}: UploadFileOptions): UploadTask {
  const token = localStorage.getItem("token");

  const xhr = new XMLHttpRequest();

  const promise = (async () => {
    //////////////////////////////////////////////////////
    // 1️⃣ PEDIR PRESIGNED URL
    //////////////////////////////////////////////////////

    const presignedRes = await fetch(
      `${import.meta.env.VITE_API_URL}/uploads/presigned`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          filename: file.name,
          type: file.type,
          folder: "mods",
        }),
      }
    );

    if (!presignedRes.ok) {
      throw new Error("Error obteniendo URL de upload");
    }

    const { url, key } = await presignedRes.json();

    //////////////////////////////////////////////////////
    // 2️⃣ SUBIR A R2
    //////////////////////////////////////////////////////

    await new Promise<void>((resolve, reject) => {
      xhr.open("PUT", url);

      xhr.upload.onprogress = (event) => {
        if (!event.lengthComputable) return;

        const progress = Math.round(
          (event.loaded / event.total) * 100
        );

        onProgress?.(progress);
      };

      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve();
        } else {
          reject(new Error("Error subiendo archivo"));
        }
      };

      xhr.onerror = () => {
        reject(new Error("Network error"));
      };

      xhr.onabort = () => {
        reject(new Error("Upload cancelado"));
      };

      xhr.send(file);
    });

    //////////////////////////////////////////////////////
    // 3️⃣ REGISTRAR EN BACKEND
    //////////////////////////////////////////////////////

    const registerRes = await fetch(
      `${import.meta.env.VITE_API_URL}/versions/${versionId}/files`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          key,
          filename: file.name,
          size: file.size,
          type: file.type,
        }),
      }
    );

    if (!registerRes.ok) {
      throw new Error("Error registrando archivo");
    }

    return registerRes.json();
  })();

  return {
    promise,

    cancel() {
      xhr.abort();
    },
  };
}