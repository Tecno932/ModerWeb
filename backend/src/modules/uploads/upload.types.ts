export interface PresignedUploadInput {
  filename: string;
  type: string;
  folder: "mods" | "avatars" | "banners";
}

export type UploadFolder =
  | "avatars"
  | "banners"
  | "mods";