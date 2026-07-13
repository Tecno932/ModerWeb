const API_URL =
  import.meta.env.VITE_API_URL;

const R2_PUBLIC_URL =
  import.meta.env.VITE_R2_PUBLIC_URL;

export async function uploadImage(
  file: File,
  folder: "avatars" | "banners"
) {
  const token =
    localStorage.getItem("token");

  ////////////////////////////////////////////////////
  // PRESIGNED
  ////////////////////////////////////////////////////

  const presignedRes =
    await fetch(
      `${API_URL}/uploads/presigned`,
      {
        method: "POST",

        headers: {
          "Content-Type":
            "application/json",

          Authorization:
            `Bearer ${token}`,
        },

        body: JSON.stringify({
          filename: file.name,
          type: file.type,
          folder,
        }),
      }
    );

  if (!presignedRes.ok) {
    throw new Error(
      "Error obteniendo upload url"
    );
  }

  const {
    url,
    key,
  } =
    await presignedRes.json();

  ////////////////////////////////////////////////////
  // UPLOAD
  ////////////////////////////////////////////////////

  const upload =
    await fetch(url, {
      method: "PUT",
      body: file,
    });

  if (!upload.ok) {
    throw new Error(
      "Error subiendo imagen"
    );
  }

  ////////////////////////////////////////////////////
  // RETURN PUBLIC URL
  ////////////////////////////////////////////////////

  return `${R2_PUBLIC_URL}/${key}?v=${Date.now()}`;
}