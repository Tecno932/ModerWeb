export interface AuthUser {
  id: number;

  username: string;

  email: string;

  avatar: string | null;

  bio: string | null;

  role: string;

  isVerified: boolean;

  createdAt: string;

  updatedAt: string;

  lastLoginAt: string | null;
}