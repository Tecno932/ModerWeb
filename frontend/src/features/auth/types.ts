export interface UserStats {
  mods: number;
  comments: number;
  followers: number;
  following: number;
}

export interface SocialLink {
  id: number;

  platform: string;

  url: string;
}

export interface EquippedCosmetic {
  id: number;

  type: string;

  cosmetic: {
    id: number;

    name: string;

    imageUrl: string;

    rarity: string;
  };
}

export interface AuthUser {
  id: number;

  username: string;

  email: string;

  role: string;

  isVerified: boolean;

  createdAt: string;

  updatedAt: string;

  lastLoginAt: string | null;

  profile: {
    displayName: string | null;

    avatarUrl: string | null;

    bannerUrl: string | null;

    bio: string | null;

    accentColor: string | null;

    socials: SocialLink[];

    equippedCosmetics:
      EquippedCosmetic[];
  } | null;

  stats: {
    mods: number;

    comments: number;

    followers: number;

    following: number;
  };
}

export interface PublicProfile {
  id: number;

  username: string;

  createdAt: string;

  profile: {
    displayName: string | null;

    avatarUrl: string | null;

    bannerUrl: string | null;

    bio: string | null;

    accentColor: string | null;

    socials: SocialLink[];

    equippedCosmetics:
      EquippedCosmetic[];
  };

  isFollowing: boolean;

  stats: UserStats;
}