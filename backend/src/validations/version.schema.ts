import { z } from "zod";
import { Loader } from "@prisma/client";

export const createVersionSchema = z.object({
  version: z.string(),
  minecraftVersion: z.string(),
  loader: z.nativeEnum(Loader).nullable().optional(),
  changelog: z.string().optional(),
});