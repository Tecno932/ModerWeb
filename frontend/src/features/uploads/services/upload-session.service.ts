////////////////////////////////////////////////////////
// TYPES
////////////////////////////////////////////////////////

export type UploadSession = {
  uploadId: string;

  key: string;

  filename: string;

  size: number;

  uploadedParts: {
    ETag: string;

    PartNumber: number;
  }[];
};

////////////////////////////////////////////////////////
// STORAGE KEY
////////////////////////////////////////////////////////

const STORAGE_KEY =
  "multipart-upload-sessions";

////////////////////////////////////////////////////////
// GET ALL
////////////////////////////////////////////////////////

function getAllSessions(): UploadSession[] {
  const raw =
    localStorage.getItem(
      STORAGE_KEY
    );

  if (!raw) {
    return [];
  }

  try {
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

////////////////////////////////////////////////////////
// SAVE ALL
////////////////////////////////////////////////////////

function saveAllSessions(
  sessions: UploadSession[]
) {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(sessions)
  );
}

////////////////////////////////////////////////////////
// SAVE SESSION
////////////////////////////////////////////////////////

export function saveUploadSession(
  session: UploadSession
) {
  const sessions =
    getAllSessions();

  const filtered =
    sessions.filter(
      (s) =>
        !(
          s.filename ===
            session.filename &&
          s.size ===
            session.size
        )
    );

  filtered.push(session);

  saveAllSessions(filtered);
}

////////////////////////////////////////////////////////
// GET SESSION
////////////////////////////////////////////////////////

export function getUploadSession(
  file: File
) {
  const sessions =
    getAllSessions();

  return sessions.find(
    (s) =>
      s.filename === file.name &&
      s.size === file.size
  );
}

////////////////////////////////////////////////////////
// REMOVE SESSION
////////////////////////////////////////////////////////

export function removeUploadSession(
  file: File
) {
  const sessions =
    getAllSessions();

  const filtered =
    sessions.filter(
      (s) =>
        !(
          s.filename ===
            file.name &&
          s.size === file.size
        )
    );

  saveAllSessions(filtered);
}