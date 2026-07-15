export interface CreateCommentInput {
  modId: number;
  userId: number;
  content: string;
}

export interface UpdateCommentInput {
  commentId: number;
  userId: number;
  content: string;
}

export interface CreateReplyInput {
  parentId: number;
  userId: number;
  content: string;
}