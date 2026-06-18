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

  stats: UserStats;
}