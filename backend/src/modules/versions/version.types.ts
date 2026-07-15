import { Loader } from "@prisma/client";

export interface CreateVersionInput {
  version: string;
  minecraftVersion: string;
  loader?: Loader | null;
  changelog?: string;
}