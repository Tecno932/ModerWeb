import { Scopes } from "./scopes";

export const Roles = {
  OWNER: "owner",
  ADMIN: "admin",
  MEMBER: "member",
} as const;

export const RoleScopes: Record<string, string[]> = {
  owner: Object.values(Scopes),

  admin: [
    Scopes.MOD_READ,
    Scopes.MOD_UPDATE,
    Scopes.VERSION_CREATE,
    Scopes.FILE_UPLOAD,
  ],

  member: [
    Scopes.MOD_READ,
    Scopes.VERSION_CREATE,
    Scopes.FILE_UPLOAD,
  ],
};