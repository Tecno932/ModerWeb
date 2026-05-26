import {
  getUploadSession,
  saveUploadSession,
  removeUploadSession,
} from "./upload-session.service";

////////////////////////////////////////////////////////
// CONFIG
////////////////////////////////////////////////////////

const CHUNK_SIZE =
  8 * 1024 * 1024;

const MAX_PARALLEL_UPLOADS = 4;

////////////////////////////////////////////////////////
// TYPES
////////////////////////////////////////////////////////

type UploadPart = {
  ETag: string;

  PartNumber: number;
};

type ChunkTask = {
  chunk: Blob;

  partNumber: number;
};

////////////////////////////////////////////////////////
// RETRY CONFIG
////////////////////////////////////////////////////////

const MAX_RETRIES = 3;

const RETRY_DELAY = 1000;

////////////////////////////////////////////////////////
// SLEEP
////////////////////////////////////////////////////////

function sleep(ms: number) {
  return new Promise((resolve) =>
    setTimeout(resolve, ms)
  );
}

////////////////////////////////////////////////////////
// UPLOAD CHUNK WITH RETRY
////////////////////////////////////////////////////////

async function uploadChunkWithRetry({
  url,
  chunk,
  retries = MAX_RETRIES,
}: {
  url: string;

  chunk: Blob;

  retries?: number;
}) {
  let lastError: unknown;

  for (
    let attempt = 1;
    attempt <= retries;
    attempt++
  ) {
    try {
      const response = await fetch(
        url,
        {
          method: "PUT",

          body: chunk,
        }
      );

      if (!response.ok) {
        throw new Error(
          `Chunk upload failed (${response.status})`
        );
      }

      return response;
    } catch (err) {
      lastError = err;

      console.error(
        `Chunk retry ${attempt}/${retries}`,
        err
      );

      //////////////////////////////////////////////////
      // WAIT BEFORE RETRY
      //////////////////////////////////////////////////

      if (attempt < retries) {
        await sleep(RETRY_DELAY);
      }
    }
  }

  throw lastError;
}

////////////////////////////////////////////////////////
// SPLIT FILE
////////////////////////////////////////////////////////

function splitFile(
  file: File
) {
  const chunks: ChunkTask[] = [];

  let start = 0;

  let partNumber = 1;

  while (start < file.size) {
    const end =
      start + CHUNK_SIZE;

    chunks.push({
      chunk: file.slice(
        start,
        end
      ),

      partNumber,
    });

    start = end;

    partNumber++;
  }

  return chunks;
}

////////////////////////////////////////////////////////
// MULTIPART UPLOAD
////////////////////////////////////////////////////////

export async function multipartUpload({
  file,
  onProgress,
}: {
  file: File;

  onProgress?: (
    progress: number
  ) => void;
}) {
  //////////////////////////////////////////////////////
  // TOKEN
  //////////////////////////////////////////////////////

  const token =
    localStorage.getItem(
      "token"
    );

  //////////////////////////////////////////////////////
  // EXISTING SESSION?
  //////////////////////////////////////////////////////

  let existingSession =
    getUploadSession(file);

  let uploadId =
    existingSession?.uploadId;

  let key =
    existingSession?.key;

  let uploadedParts:
    UploadPart[] =
    existingSession?.uploadedParts ||
    [];

  //////////////////////////////////////////////////////
  // START NEW MULTIPART
  //////////////////////////////////////////////////////

  if (!uploadId || !key) {
    const startRes =
      await fetch(
        `${import.meta.env.VITE_API_URL}/uploads/start`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",

            Authorization:
              `Bearer ${token}`,
          },

          body: JSON.stringify({
            filename:
              file.name,

            type: file.type,
          }),
        }
      );

    if (!startRes.ok) {
      throw new Error(
        "Error starting upload"
      );
    }

    const data =
      await startRes.json();

    uploadId =
      data.uploadId;

    key = data.key;

    ////////////////////////////////////////////////////
    // SAVE SESSION
    ////////////////////////////////////////////////////

    saveUploadSession({
      uploadId: uploadId!,
      key: key!,

      filename:
        file.name,

      size: file.size,

      uploadedParts: [],
    });
  }

  //////////////////////////////////////////////////////
  // SPLIT CHUNKS
  //////////////////////////////////////////////////////

  const allChunks =
    splitFile(file);

  //////////////////////////////////////////////////////
  // FILTER ALREADY UPLOADED
  //////////////////////////////////////////////////////

  const uploadedPartNumbers =
    new Set(
      uploadedParts.map(
        (p) =>
          p.PartNumber
      )
    );

  const pendingChunks =
    allChunks.filter(
      (chunk) =>
        !uploadedPartNumbers.has(
          chunk.partNumber
        )
    );

  //////////////////////////////////////////////////////
  // INITIAL PROGRESS
  //////////////////////////////////////////////////////

  let uploadedChunks =
    uploadedParts.length;

  onProgress?.(
    Math.round(
      (uploadedChunks /
        allChunks.length) *
        100
    )
  );

  //////////////////////////////////////////////////////
  // WORKER
  //////////////////////////////////////////////////////

  async function worker() {
    while (
      pendingChunks.length > 0
    ) {
      const current =
        pendingChunks.shift();

      if (!current) {
        return;
      }

      ////////////////////////////////////////////////
      // GET PART URL
      ////////////////////////////////////////////////

      const urlRes =
        await fetch(
          `${import.meta.env.VITE_API_URL}/uploads/part-url`,
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",

              Authorization:
                `Bearer ${token}`,
            },

            body: JSON.stringify({
              uploadId,

              key,

              partNumber:
                current.partNumber,
            }),
          }
        );

      if (!urlRes.ok) {
        throw new Error(
          "Error getting part URL"
        );
      }

      const { url } =
        await urlRes.json();

      ////////////////////////////////////////////////
      // UPLOAD CHUNK
      ////////////////////////////////////////////////

    const uploadRes =
      await uploadChunkWithRetry({
        url,

        chunk: current.chunk,
      });

      if (!uploadRes.ok) {
        throw new Error(
          `Chunk ${current.partNumber} failed`
        );
      }

      ////////////////////////////////////////////////
      // ETAG
      ////////////////////////////////////////////////

      const etag =
        uploadRes.headers.get(
          "ETag"
        );

      if (!etag) {
        throw new Error(
          "Missing ETag"
        );
      }

      ////////////////////////////////////////////////
      // SAVE PART
      ////////////////////////////////////////////////

      const uploadedPart = {
        ETag: etag,

        PartNumber:
          current.partNumber,
      };

      uploadedParts.push(
        uploadedPart
      );

      ////////////////////////////////////////////////
      // SAVE SESSION
      ////////////////////////////////////////////////

      saveUploadSession({
        uploadId:
          uploadId!,

        key: key!,

        filename:
          file.name,

        size: file.size,

        uploadedParts,
      });

      ////////////////////////////////////////////////
      // PROGRESS
      ////////////////////////////////////////////////

      uploadedChunks++;

      const progress =
        Math.round(
          (uploadedChunks /
            allChunks.length) *
            100
        );

      onProgress?.(progress);
    }
  }

  //////////////////////////////////////////////////////
  // START WORKERS
  //////////////////////////////////////////////////////

  const workers =
    Array.from(
      {
        length:
          MAX_PARALLEL_UPLOADS,
      },
      () => worker()
    );

  await Promise.all(workers);

  //////////////////////////////////////////////////////
  // SORT PARTS
  //////////////////////////////////////////////////////

  uploadedParts.sort(
    (a, b) =>
      a.PartNumber -
      b.PartNumber
  );

  //////////////////////////////////////////////////////
  // COMPLETE
  //////////////////////////////////////////////////////

  const completeRes =
    await fetch(
      `${import.meta.env.VITE_API_URL}/uploads/complete`,
      {
        method: "POST",

        headers: {
          "Content-Type":
            "application/json",

          Authorization:
            `Bearer ${token}`,
        },

        body: JSON.stringify({
          uploadId,

          key,

          parts:
            uploadedParts,
        }),
      }
    );

  if (!completeRes.ok) {
    throw new Error(
      "Error completing upload"
    );
  }

  //////////////////////////////////////////////////////
  // REMOVE SESSION
  //////////////////////////////////////////////////////

  removeUploadSession(file);

  //////////////////////////////////////////////////////
  // DONE
  //////////////////////////////////////////////////////

  return {
    key,
  };
}