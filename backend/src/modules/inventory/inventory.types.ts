export interface GrantInventoryInput {
  username: string;

  itemId: number;

  quantity?: number;
}

export interface RemoveInventoryInput {
  username: string;

  itemId: number;
}

export interface CheckOwnershipResponse {
  owned: boolean;

  quantity: number;
}