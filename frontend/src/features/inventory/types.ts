export interface CosmeticItem {
  id: number;

  name: string;

  slug: string;

  description: string | null;

  imageUrl: string;

  rarity: string;

  type: string;

  isActive: boolean;
}

export interface InventoryItem {
  id: number;

  quantity: number;

  obtainedAt: string;

  item: CosmeticItem;
}