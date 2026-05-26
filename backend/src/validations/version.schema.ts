import { z } from "zod";

export const createVersionSchema = z.object({
  version: z.string(),
  minecraftVersion: z.string(),
  loader: z.string().optional(),
  changelog: z.string().optional(),
});