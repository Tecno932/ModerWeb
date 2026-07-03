import styles
  from "./InventoryCard.module.css";

import type { InventoryItem, } from "../types";

import {
  useMyEquipped,
} from "@/features/equipped/hooks/useMyEquipped";

import {
  useEquipCosmetic,
} from "@/features/equipped/hooks/useEquipCosmetic";

import {
  useUnequipCosmetic,
} from "@/features/equipped/hooks/useUnequipCosmetic";

interface Props {
  item: InventoryItem;
}

export default function InventoryCard({
  item,
}: Props) {
  const {
    data: equipped,
  } = useMyEquipped();

  const equip =
    useEquipCosmetic();

  const unequip =
    useUnequipCosmetic();

  const equippedItem =
    equipped?.find(
      (e: any) =>
        e.type ===
        item.item.type
    );

  const isEquipped =
    equippedItem?.cosmeticId ===
    item.item.id;

  async function handleEquip() {
    if (isEquipped) {
      await unequip.mutateAsync(
        item.item.type
      );

      return;
    }

    await equip.mutateAsync(
      item.item.id
    );
  }

  return (
    <div
      className={
        styles.card
      }
    >
      <img
        src={
          item.item.imageUrl
        }
        alt={
          item.item.name
        }
      />

      <h3>
        {item.item.name}
      </h3>

      <span>
        {item.item.type}
      </span>

      <span>
        {item.item.rarity}
      </span>

      <span>
        x{item.quantity}
      </span>

      <button
        onClick={handleEquip}
        disabled={
          equip.isPending ||
          unequip.isPending
        }
      >
        {equip.isPending ||
        unequip.isPending
          ? "..."
          : isEquipped
          ? "Desequipar"
          : "Equipar"}
      </button>
    </div>
  );
}