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

  avatar: string | null;
  bio: string | null;

  role: string;

  isVerified: boolean;

  createdAt: Date;
  updatedAt: Date;

  lastLoginAt: Date | null;
}