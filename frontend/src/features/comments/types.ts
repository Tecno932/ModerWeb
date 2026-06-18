export type CommentUser = {
  id: number;
  username: string;
  avatar: string | null;
};

export type Comment = {
  id: number;

  modId: number;
  userId: number;

  parentId: number | null;

  content: string;

  deleted: boolean;

  createdAt: string;
  updatedAt: string;

  user: CommentUser;

  replies?: Comment[];
};