import { z } from "zod";

export const createModSchema = z.object({
  title: z.string().min(3),
  description: z.string().min(3),
  content: z.string().optional(),
  platform: z.string(),
  loader: z.string().optional(),
  type: z.string(),
  tags: z.any().optional(),
});

export const updateModSchema = z.object({
  title: z.string().min(3).optional(),
  description: z.string().optional(),
  content: z.string().optional(),
  platform: z.string().optional(),
  loader: z.string().optional(),
  type: z.string().optional(),
});