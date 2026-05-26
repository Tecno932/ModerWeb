import { create } from "zustand";

import { persist } from "zustand/middleware";

import {
  uploadVersionFile,
} from "@/features/uploads/services/upload.service";

import type {
  UploadTask,
} from "@/features/uploads/services/upload.service";

import {
  saveUploadFile,
  getUploadFile,
  removeUploadFile,
} from "@/features/uploads/services/upload-db.service";

////////////////////////////////////////////////////////
// TYPES
////////////////////////////////////////////////////////

export type UploadStatus =
  | "queued"
  | "uploading"
  | "done"
  | "error"
  | "cancelled";

export type UploadItem = {
  id: string;

  versionId: number;

  file?: File;

  filename: string;

  createdAt: number;

  completedAt?: number;

  progress: number;

  status: UploadStatus;

  error?: string;

  isRemoving?: boolean;

  task?: UploadTask;
};

////////////////////////////////////////////////////////
// CONFIG
////////////////////////////////////////////////////////

const MAX_PARALLEL_UPLOADS = 3;

const AUTO_REMOVE_DELAY = 4000;

const FADE_DURATION = 300;

const ONE_HOUR =
  1000 * 60 * 60;

////////////////////////////////////////////////////////
// STORE
////////////////////////////////////////////////////////

type UploadStore = {
  uploads: UploadItem[];

  addFiles: (
    versionId: number,
    files: File[]
  ) => void;

  processQueue: () => void;

  cancelUpload: (
    id: string
  ) => void;

  retryUpload: (
    id: string
  ) => void;

  removeUpload: (
    id: string
  ) => void;

  cleanupOldUploads: () => void;
};

////////////////////////////////////////////////////////
// STORE
////////////////////////////////////////////////////////

export const useUploadStore =
  create<UploadStore>()(
    persist(
      (set, get) => ({
        //////////////////////////////////////////////////
        // STATE
        //////////////////////////////////////////////////

        uploads: [],

        //////////////////////////////////////////////////
        // ADD FILES
        //////////////////////////////////////////////////

        addFiles(versionId, files) {
          const mapped: UploadItem[] =
            files.map((file) => ({
              id:
                Math.random()
                  .toString(36)
                  .slice(2) +
                Date.now(),

              versionId,

              file,

              filename:
                file.name,

              createdAt:
                Date.now(),

              progress: 0,

              status: "queued",
            }));

            mapped.forEach((upload) => {
              if (upload.file) {
                saveUploadFile(
                  upload.id,
                  upload.file
                );
              }
            });

          set((state) => ({
            uploads: [
              ...state.uploads,
              ...mapped,
            ],
          }));

          get().processQueue();
        },

        //////////////////////////////////////////////////
        // PROCESS QUEUE
        //////////////////////////////////////////////////

        processQueue() {
          const state = get();

          //////////////////////////////////////////////////
          // ACTIVE
          //////////////////////////////////////////////////

          const activeUploads =
            state.uploads.filter(
              (u) =>
                u.status ===
                "uploading"
            );

          if (
            activeUploads.length >=
            MAX_PARALLEL_UPLOADS
          ) {
            return;
          }

          //////////////////////////////////////////////////
          // NEXT
          //////////////////////////////////////////////////

          const next =
            state.uploads.find(
              (u) =>
                u.status ===
                  "queued" &&
                u.file
            );

          if (!next) {
            return;
          }

          //////////////////////////////////////////////////
          // FILE LOST
          //////////////////////////////////////////////////

          if (!next.file) {
            set((state) => ({
              uploads:
                state.uploads.map(
                  (u) =>
                    u.id ===
                    next.id
                      ? {
                          ...u,

                          status:
                            "error",

                          error:
                            "Archivo perdido después de refrescar",
                        }
                      : u
                ),
            }));

            return;
          }

          //////////////////////////////////////////////////
          // START UPLOAD
          //////////////////////////////////////////////////

          const task =
            uploadVersionFile({
              versionId:
                next.versionId,

              file: next.file,

              onProgress(
                progress
              ) {
                set((state) => ({
                  uploads:
                    state.uploads.map(
                      (u) =>
                        u.id ===
                        next.id
                          ? {
                              ...u,
                              progress,
                            }
                          : u
                    ),
                }));
              },
            });

          //////////////////////////////////////////////////
          // SET UPLOADING
          //////////////////////////////////////////////////

          set((state) => ({
            uploads:
              state.uploads.map(
                (u) =>
                  u.id === next.id
                    ? {
                        ...u,

                        status:
                          "uploading",

                        task,
                      }
                    : u
              ),
          }));

          //////////////////////////////////////////////////
          // HANDLE RESULT
          //////////////////////////////////////////////////

          task.promise
            .then(() => {
              set((state) => ({
                uploads:
                  state.uploads.map(
                    (u) =>
                      u.id ===
                      next.id
                        ? {
                            ...u,

                            status:
                              "done",

                            progress: 100,

                            completedAt:
                              Date.now(),
                          }
                        : u
                  ),
              }));

              //////////////////////////////////////////////
              // AUTO REMOVE
              //////////////////////////////////////////////

              setTimeout(() => {
                get().removeUpload(
                  next.id
                );
              }, AUTO_REMOVE_DELAY);
            })

            .catch((err) => {
              const cancelled =
                err.message ===
                "Upload cancelado";

              set((state) => ({
                uploads:
                  state.uploads.map(
                    (u) =>
                      u.id ===
                      next.id
                        ? {
                            ...u,

                            status:
                              cancelled
                                ? "cancelled"
                                : "error",

                            error:
                              err.message,
                          }
                        : u
                  ),
              }));
            })

            .finally(() => {
              get().processQueue();
            });

          //////////////////////////////////////////////////
          // CONTINUE
          //////////////////////////////////////////////////

          get().processQueue();
        },

        //////////////////////////////////////////////////
        // CANCEL
        //////////////////////////////////////////////////

        cancelUpload(id) {
          const upload =
            get().uploads.find(
              (u) =>
                u.id === id
            );

          upload?.task?.cancel();
        },

        //////////////////////////////////////////////////
        // RETRY
        //////////////////////////////////////////////////

        retryUpload(id) {
          set((state) => ({
            uploads:
              state.uploads.map(
                (u) =>
                  u.id === id
                    ? {
                        ...u,

                        progress: 0,

                        status:
                          "queued",

                        error:
                          undefined,

                        isRemoving:
                          false,
                      }
                    : u
              ),
          }));

          get().processQueue();
        },

        //////////////////////////////////////////////////
        // REMOVE
        //////////////////////////////////////////////////

        removeUpload(id) {
          removeUploadFile(id);
          ////////////////////////////////////////////////
          // START FADE
          ////////////////////////////////////////////////

          set((state) => ({
            uploads:
              state.uploads.map(
                (u) =>
                  u.id === id
                    ? {
                        ...u,

                        isRemoving:
                          true,
                      }
                    : u
              ),
          }));

          ////////////////////////////////////////////////
          // REMOVE AFTER ANIMATION
          ////////////////////////////////////////////////

          setTimeout(() => {
            set((state) => ({
              uploads:
                state.uploads.filter(
                  (u) =>
                    u.id !== id
                ),
            }));
          }, FADE_DURATION);
        },

        //////////////////////////////////////////////////
        // CLEANUP
        //////////////////////////////////////////////////

        cleanupOldUploads() {
          const now = Date.now();

          set((state) => ({
            uploads:
              state.uploads.filter(
                (u) => {
                  //////////////////////////////////////////
                  // KEEP ACTIVE
                  //////////////////////////////////////////

                  if (
                    u.status ===
                      "uploading" ||
                    u.status ===
                      "queued"
                  ) {
                    return true;
                  }

                  //////////////////////////////////////////
                  // KEEP FAILED
                  //////////////////////////////////////////

                  if (
                    u.status ===
                      "error" ||
                    u.status ===
                      "cancelled"
                  ) {
                    return true;
                  }

                  //////////////////////////////////////////
                  // REMOVE OLD DONE
                  //////////////////////////////////////////

                  if (
                    u.status ===
                    "done"
                  ) {
                    return (
                      now -
                        (u.completedAt ||
                          now) <
                      ONE_HOUR
                    );
                  }

                  return true;
                }
              ),
          }));
        },
      }),

      ////////////////////////////////////////////////////
      // PERSIST
      ////////////////////////////////////////////////////

      {
        name: "upload-store",

        ////////////////////////////////////////////////////
        // PARTIALIZE
        ////////////////////////////////////////////////////

        partialize: (state) => ({
          uploads:
            state.uploads.map(
              (u) => ({
                id: u.id,

                versionId:
                  u.versionId,

                filename:
                  u.filename,

                createdAt:
                  u.createdAt,

                completedAt:
                  u.completedAt,

                progress:
                  u.progress,

                status:
                  u.status,

                error:
                  u.error,

                isRemoving:
                  false,
              })
            ),
        }),

        ////////////////////////////////////////////////////
        // REHYDRATE
        ////////////////////////////////////////////////////

        onRehydrateStorage() {
          return async (state) => {
            if (!state) {
              return;
            }

          ////////////////////////////////////////////////
          // RECOVER FILES
          ////////////////////////////////////////////////

          const recoveredUploads: UploadItem[] =
            await Promise.all(
              state.uploads.map(
                async (upload) => {
                  const file =
                    await getUploadFile(
                      upload.id
                    );

                  const status: UploadStatus =
                    upload.status ===
                      "uploading" ||
                    upload.status ===
                      "queued"
                      ? "queued"
                      : upload.status;

                  return {
                    ...upload,

                    file,

                    status,
                  };
                }
              )
            );

            ////////////////////////////////////////////////
            // RESTORE
            ////////////////////////////////////////////////

            state.uploads =
              recoveredUploads;

            ////////////////////////////////////////////////
            // AUTO RESUME
            ////////////////////////////////////////////////

            setTimeout(() => {
              state.processQueue();
            }, 500);
          };
        },
      }
    )
  );