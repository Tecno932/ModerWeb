import { apiFetch } from "@/shared/api/client";

////////////////////////////////////////////////////////
// TYPES
////////////////////////////////////////////////////////

export type VersionFile = {
  id: number;

  filename?: string;

  displayName?: string;

  size: number;

  releaseType: string;

  downloads: number;

  url?: string;

  isPrimary?: boolean;
};

export type Version = {
  id: number;

  version: string;

  minecraftVersion: string;

  loader?: string;

  changelog?: string;

  createdAt: string;

  files?: VersionFile[];

  isUploading?: boolean;
};

////////////////////////////////////////////////////////
// GET VERSIONS
////////////////////////////////////////////////////////

export const getVersions = (
  modId: string | number
): Promise<Version[]> =>
  apiFetch(`/mods/${modId}/versions`);

////////////////////////////////////////////////////////
// CREATE VERSION
////////////////////////////////////////////////////////

export const createVersion = (data: {
  modId: string | number;
  version: string;
  minecraftVersion: string;
  loader?: string;
  changelog?: string;
}) =>
  apiFetch(`/mods/${data.modId}/versions`, {
    method: "POST",

    body: JSON.stringify({
      version: data.version,
      minecraftVersion: data.minecraftVersion,
      loader: data.loader,
      changelog: data.changelog,
    }),
  });

////////////////////////////////////////////////////////
// UPDATE VERSION
////////////////////////////////////////////////////////

export const updateVersion = ({
  versionId,
  version,
}: {
  versionId: number;
  version: string;
}) =>
  apiFetch(`/versions/${versionId}`, {
    method: "PATCH",

    body: JSON.stringify({
      version,
    }),
  });

////////////////////////////////////////////////////////
// DELETE VERSION
////////////////////////////////////////////////////////

export const deleteVersion = (
  versionId: number
) =>
  apiFetch(`/versions/${versionId}`, {
    method: "DELETE",
  });

////////////////////////////////////////////////////////
// DOWNLOAD VERSION
////////////////////////////////////////////////////////

export const getVersionDownloadUrl = (
  versionId: number
) =>
  `${import.meta.env.VITE_API_URL}/versions/${versionId}/download`;

////////////////////////////////////////////////////////
// UPLOAD FILE TO R2
////////////////////////////////////////////////////////

export async function uploadFileR2(data: {
  versionId: number;
  file: File;

  onProgress?: (
    progress: number
  ) => void;
}) {
  const token = localStorage.getItem("token");

  //////////////////////////////////////////////////////
  // 1️⃣ CREATE PRESIGNED URL
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
        filename: data.file.name,
        type: data.file.type,
        folder: "mods",
      }),
    }
  );

  if (!presignedRes.ok) {
    throw new Error(
      "Error creating presigned URL"
    );
  }

  const { url, key } =
    await presignedRes.json();

  //////////////////////////////////////////////////////
  // 2️⃣ UPLOAD TO R2
  //////////////////////////////////////////////////////

  await new Promise<void>(
    (resolve, reject) => {
      const xhr = new XMLHttpRequest();

      xhr.open("PUT", url);

      xhr.upload.onprogress = (e) => {
        if (!e.lengthComputable) return;

        const percent = Math.round(
          (e.loaded / e.total) * 100
        );

        data.onProgress?.(percent);
      };

      xhr.onload = () => {
        if (
          xhr.status >= 200 &&
          xhr.status < 300
        ) {
          resolve();
        } else {
          reject(
            new Error(
              "Error uploading file"
            )
          );
        }
      };

      xhr.onerror = () => {
        reject(
          new Error(
            "Network upload error"
          )
        );
      };

      xhr.send(data.file);
    }
  );

  //////////////////////////////////////////////////////
  // 3️⃣ REGISTER FILE
  //////////////////////////////////////////////////////

  const res = await fetch(
    `${import.meta.env.VITE_API_URL}/versions/${data.versionId}/files`,
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",

        Authorization: `Bearer ${token}`,
      },

      body: JSON.stringify({
        key,

        filename: data.file.name,

        size: data.file.size,

        type: data.file.type,
      }),
    }
  );

  if (!res.ok) {
    throw new Error(
      "Error registering file"
    );
  }

  return res.json();
}