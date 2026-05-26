import { z } from "zod";

export const createModSchema = z.object({
  title: z.string().min(3).max(80),

  summary: z.string().max(180).optional(),

  description: z.string().min(10).max(5000),

  content: z.string().optional(),

  license: z.string().max(100).optional(),

  sourceUrl: z.string().url().optional().or(z.literal("")),
  issuesUrl: z.string().url().optional().or(z.literal("")),
  discordUrl: z.string().url().optional().or(z.literal("")),
  websiteUrl: z.string().url().optional().or(z.literal("")),
  wikiUrl: z.string().url().optional().or(z.literal("")),
  donationUrl: z.string().url().optional().or(z.literal("")),

  platform: z.enum(["JAVA", "BEDROCK"]),

  type: z.enum([
    "PLUGIN",
    "MOD",
    "MODPACK",
    "SHADER",
    "DATA_PACK",
    "RESOURCE_PACK",
    "WORLD",
    "ADDON",
    "TEXTURE",
    "SCRIPT",
    "CUSTOM",
  ]),

  loader: z
    .enum([
      "FORGE",
      "NEOFORGE",
      "FABRIC",
      "QUILT",
      "LITELOADER",
      "PAPER",
      "SPIGOT",
      "PURPUR",
      "BUKKIT",
      "FOLIA",
    ])
    .nullable()
    .optional(),

  visibility: z.enum([
    "PUBLIC",
    "UNLISTED",
    "PRIVATE",
  ]),

  categories: z.array(z.string()).max(10),

  tags: z.array(z.string()).max(20),
});