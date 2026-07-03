import {
  CosmeticType,
  CosmeticRarity,
} from "@prisma/client";

export interface CreateCosmeticInput {
  name: string;

  slug: string;

  description?: string;

  imageUrl: string;

  type: CosmeticType;

  rarity: CosmeticRarity;
}

export interface UpdateCosmeticInput {
  name?: string;

  description?: string;

  imageUrl?: string;

  type?: CosmeticType;

  rarity?: CosmeticRarity;

  isActive?: boolean;
}