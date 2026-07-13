//////////////////////////////////////////////////
// MIME TYPES
//////////////////////////////////////////////////

export const IMAGE_MIME_TYPES = [
  "image/png",
  "image/jpeg",
  "image/webp",
  "image/gif",
] as const;

export const MOD_FILE_MIME_TYPES = [
  "application/java-archive",
  "application/zip",
  "application/x-zip-compressed",
  "application/octet-stream",
] as const;

//////////////////////////////////////////////////
// SIZE LIMITS
//////////////////////////////////////////////////

export const MAX_AVATAR_SIZE =
  5 * 1024 * 1024;

export const MAX_BANNER_SIZE =
  10 * 1024 * 1024;

export const MAX_MOD_FILE_SIZE =
  2 * 1024 * 1024 * 1024; // 2GB