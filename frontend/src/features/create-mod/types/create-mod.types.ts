export interface CreateModFormData {
  title: string;

  summary: string;

  description: string;

  content: string;

  license: string;

  sourceUrl: string;
  issuesUrl: string;
  discordUrl: string;
  websiteUrl: string;
  wikiUrl: string;
  donationUrl: string;

  platform: string;

  type: string;

  loader: string;

  visibility: string;

  categories: string[];

  tags: string[];

  icon: File | null;

  gallery: File[];
}