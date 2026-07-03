import {
  CosmeticType,
} from "@prisma/client";

export interface EquipCosmeticInput {
  cosmeticId: number;
}

export interface UnequipInput {
  type: CosmeticType;
}