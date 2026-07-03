import { useParams, useNavigate } from "react-router-dom";
import { Pencil } from "lucide-react";
import { useAuth } from "@/features/auth/context/AuthContext";

import { useProfile } from "@/features/users/hooks/useProfile";
import Container from "@/shared/ui/container/Container";

import ProfileHeader from "@/features/users/components/userheader/ProfileHeader";
import ProfileStats from "@/features/users/components/ProfileStats";
import ProfileSocials from "@/features/users/components/ProfileSocials";
import FollowButton from "@/features/follows/components/FollowButton";

import styles from "./ProfilePage.module.css";

export default function ProfilePage() {
  const { username } = useParams();
  const navigate = useNavigate();
  const authUser = useAuth();

  const { data, isLoading, error } = useProfile(username ?? "");

  if (isLoading) return <div>Cargando...</div>;
  if (error || !data) return <div>Usuario no encontrado</div>;

  const isOwner = authUser.user?.id === data.id;

  return (
    <Container>
      <div className={styles.profileLayout}>
        <aside className={styles.sidebar}>
        <ProfileHeader
          username={data.username}
          displayName={data.profile?.displayName ?? null}
          avatarUrl={data.profile?.avatarUrl ?? null}
          bannerUrl={data.profile?.bannerUrl ?? null}
          bio={data.profile?.bio ?? null}
          createdAt={data.createdAt}
          stats={
            <ProfileStats
              mods={data.stats.mods}
              followers={data.stats.followers}
              following={data.stats.following}
            />
          }
          socials={
            <ProfileSocials
              socials={data.profile?.socials ?? []}
            />
          }
          actionButton={
            isOwner ? (
              <button
                className={styles.profileButton}
                onClick={() => navigate("/profile/edit")}
              >
              <Pencil size={15} />
                
              </button>
            ) : authUser.isAuthenticated ? (
              <FollowButton
                username={data.username}
                isFollowing={data.isFollowing}
              />
            ) : null
          }
        />
        </aside>

        <main className={styles.content}>
        <div className={styles.tabs}>
          <button className={styles.tab}>Mods</button>
          <button className={styles.tab}>Inventario</button>
          <button className={styles.tab}>Comentarios</button>
        </div>
        </main>
      </div>
    </Container>
  );
}