export const Roles = {
  OWNER: "owner",
  ADMIN: "admin",
  MEMBER: "member",
} as const;

export const Permissions = {
  MOD_UPDATE: "mod:update",
  MOD_DELETE: "mod:delete",
  VERSION_CREATE: "version:create",
  FILE_UPLOAD: "file:upload",
} as const;

export const RolePermissions: Record<string, string[]> = {
  owner: [
    Permissions.MOD_UPDATE,
    Permissions.MOD_DELETE,
    Permissions.VERSION_CREATE,
    Permissions.FILE_UPLOAD,
  ],
  admin: [
    Permissions.MOD_UPDATE,
    Permissions.VERSION_CREATE,
    Permissions.FILE_UPLOAD,
  ],
  member: [
    Permissions.VERSION_CREATE,
    Permissions.FILE_UPLOAD,
  ],
};