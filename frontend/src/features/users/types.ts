export interface UserStats {
  mods: number;
  comments: number;
  followers: number;
  following: number;
}

export interface PublicProfile {
  id: number;

  username: string;

  avatar: string | null;

  bio: string | null;

  createdAt: string;

  isFollowing: boolean;

  profile: {
    displayName: string | null;

    avatarUrl: string | null;
    bannerUrl: string | null;

    bio: string | null;

    accentColor: string | null;

    socials: ProfileSocial[];

    equippedCosmetics: any[];
  };

  stats: UserStats;
}

export interface ProfileSocial {
  id: number;

  platform:
    | "GITHUB"
    | "DISCORD"
    | "YOUTUBE"
    | "INSTAGRAM"
    | "PATREON"
    | "KOFI"
    | "TWITCH"
    | "X"
    | "TIKTOK"
    | "WEBSITE";

  url: string;
}