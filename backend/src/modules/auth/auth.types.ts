export interface RegisterInput {
  username: string;
  email: string;
  password: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface AuthUser {
  id: number;

  username: string;
  email: string;

  role: string;

  isVerified: boolean;

  createdAt: Date;
  updatedAt: Date;

  lastLoginAt: Date | null;

  profile: {
    displayName: string | null;

    avatarUrl: string | null;
    bannerUrl: string | null;

    bio: string | null;

    accentColor: string | null;
  } | null;
}

export interface RefreshInput {
  refreshToken: string;
}