import {
  Loader,
  Platform,
  ProjectType,
  Visibility,
} from "@prisma/client";

export interface CreateModDto {
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

  visibility: Visibility;

  categories: string[];

  tags: string[];
}