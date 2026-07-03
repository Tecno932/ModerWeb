export interface SocialLink {
  id: number;

  platform: string;

  url: string;
}

export interface SaveSocialInput {
  platform: string;

  url: string;
}