export interface ModInteractionsResponse {
  liked: boolean;
  favorited: boolean;

  likesCount: number;
  favoritesCount: number;
}

export interface ToggleInteractionInput {
  modId: number;
  userId: number;
}