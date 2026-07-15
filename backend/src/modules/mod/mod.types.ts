import type {
  Loader,
  Platform,
  ProjectType,
  Visibility,
} from "@prisma/client";

export interface CreateModInput {
  title: string;
  summary?: string;
  description: string;
  content?: string;
  license?: string;

  sourceUrl?: string;
  issuesUrl?: string;
  discordUrl?: string;
  websiteUrl?: string;
  wikiUrl?: string;
  donationUrl?: string;

  platform: Platform;
  type: ProjectType;
  loader?: Loader | null;
  visibility?: Visibility;

  categories?: string[] | string;
  tags?: string[] | string;
}

export interface UpdateModInput {
  title?: string;
  summary?: string;
  description?: string;
  content?: string;
  license?: string;

  sourceUrl?: string;
  issuesUrl?: string;
  discordUrl?: string;
  websiteUrl?: string;
  wikiUrl?: string;
  donationUrl?: string;

  platform?: Platform;
  type?: ProjectType;
  loader?: Loader | null;
  visibility?: Visibility;

  categories?: string[];
}