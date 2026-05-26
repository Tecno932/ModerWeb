import { openDB } from "idb";

const DB_NAME = "uploads-db";

const STORE_NAME = "files";

////////////////////////////////////////////////////////
// DB
////////////////////////////////////////////////////////

const dbPromise = openDB(
  DB_NAME,
  1,
  {
    upgrade(db) {
      if (
        !db.objectStoreNames.contains(
          STORE_NAME
        )
      ) {
        db.createObjectStore(
          STORE_NAME
        );
      }
    },
  }
);

////////////////////////////////////////////////////////
// SAVE FILE
////////////////////////////////////////////////////////

export async function saveUploadFile(
  id: string,
  file: File
) {
  const db = await dbPromise;

  await db.put(
    STORE_NAME,
    file,
    id
  );
}

////////////////////////////////////////////////////////
// GET FILE
////////////////////////////////////////////////////////

export async function getUploadFile(
  id: string
) {
  const db = await dbPromise;

  return db.get(
    STORE_NAME,
    id
  );
}

////////////////////////////////////////////////////////
// REMOVE FILE
////////////////////////////////////////////////////////

export async function removeUploadFile(
  id: string
) {
  const db = await dbPromise;

  await db.delete(
    STORE_NAME,
    id
  );
}