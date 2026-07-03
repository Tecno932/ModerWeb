import type { InventoryItem, } from "../types";

import InventoryCard
  from "./InventoryCard";

import styles
  from "./InventoryGrid.module.css";

interface Props {
  items: InventoryItem[];
}

export default function InventoryGrid({
  items,
}: Props) {
  return (
    <div
      className={
        styles.grid
      }
    >
      {items.map(
        (item) => (
          <InventoryCard
            key={item.id}
            item={item}
          />
        )
      )}
    </div>
  );
}