import { z } from "zod";

export const fileSchema = z.object({
  versionId: z.number(),
});