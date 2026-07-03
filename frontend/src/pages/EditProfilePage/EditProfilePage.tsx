import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import Container from "@/shared/ui/container/Container";

import { useAuth } from "@/features/auth/context/AuthContext";
import { useUpdateProfile } from "@/features/users/hooks/useUpdateProfile";
import { useMyInventory } from "@/features/inventory/hooks/useMyInventory";

import EditProfileHeader from "@/features/users/components/EditProfileForm/EditProfileForm";
import SocialsManager from "@/features/socials/components/SocialsManager/SocialsManager";

import InventoryGrid from "@/features/inventory/components/InventoryGrid";

import styles from "./EditProfilePage.module.css";

export default function EditProfilePage() {
  const navigate = useNavigate();

  const { user, loading } = useAuth();
  const token = localStorage.getItem("token");

  const updateProfile = useUpdateProfile(token ?? "");
  const inventory = useMyInventory();

  const [form, setForm] = useState({
    username: "",
    displayName: "",
    bio: "",
    avatarUrl: "",
    bannerUrl: "",
    accentColor: "",
  });

  useEffect(() => {
    if (!user) return;

    setForm({
      username: user.username,
      displayName: user.profile?.displayName ?? "",
      bio: user.profile?.bio ?? "",
      avatarUrl: user.profile?.avatarUrl ?? "",
      bannerUrl: user.profile?.bannerUrl ?? "",
      accentColor: user.profile?.accentColor ?? "",
    });
  }, [user]);

  if (loading) {
    return <Container>Cargando...</Container>;
  }

  if (!user) {
    return <Container>No autorizado</Container>;
  }

  async function handleSubmit(data: {
    username: string;
    displayName: string;
    bio: string;
    avatarUrl: string;
    bannerUrl: string;
    accentColor: string;
  }) {
    await updateProfile.mutateAsync(data);
    navigate(`/users/${data.username}`);
  }

  return (
    <Container>
      <div className={styles.layout}>

        {/* SIDEBAR = EDICIÓN */}
        <aside className={styles.sidebar}>

          <EditProfileHeader
              form={form}
              setForm={setForm}
              loading={updateProfile.isPending}
              onSubmit={handleSubmit}
          />

          <SocialsManager token={token ?? ""} />

        </aside>

        {/* CONTENT = INVENTARIO */}
        <main className={styles.content}>

          <div className={styles.section}>
            <h2>Cosméticos</h2>
            <p className={styles.description}>
              Equipá marcos, fondos, insignias y otros elementos visuales de tu perfil.
            </p>
          </div>

          {inventory.isLoading ? (
            <p>Cargando inventario...</p>
          ) : inventory.error ? (
            <p>Error cargando el inventario.</p>
          ) : (
            <InventoryGrid items={inventory.data ?? []} />
          )}

        </main>

      </div>
    </Container>
  );
}