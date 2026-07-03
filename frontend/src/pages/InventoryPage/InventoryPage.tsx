import Container
  from "@/shared/ui/container/Container";

import {
  useMyInventory,
} from "@/features/inventory/hooks/useMyInventory";

import InventoryGrid
  from "@/features/inventory/components/InventoryGrid";

export default function InventoryPage() {
  const {
    data,
    isLoading,
    error,
  } =
    useMyInventory();

  if (isLoading) {
    return (
      <Container>
        Cargando...
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        Error cargando inventario
      </Container>
    );
  }

  return (
    <Container>
      <h1>
        Mi Inventario
      </h1>

      <InventoryGrid
        items={
          data ?? []
        }
      />
    </Container>
  );
}