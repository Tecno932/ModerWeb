export const Scopes = {
  MOD_READ: "mod:read",
  MOD_UPDATE: "mod:update",
  MOD_DELETE: "mod:delete",

  VERSION_CREATE: "version:create",

  FILE_UPLOAD: "file:upload",
} as const;

export type Scope = typeof Scopes[keyof typeof Scopes];