import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/features/auth/context/AuthContext";

import { useProfile } from "@/features/users/hooks/useProfile";
import Container from "@/shared/ui/container/Container";

import ProfileHeader from "@/features/users/components/ProfileHeader";
import ProfileStats from "@/features/users/components/ProfileStats";

export default function ProfilePage() {
  const { username } =
    useParams();

  const {
    data,
    isLoading,
    error,
  } = useProfile(
    username ?? ""
  );

  const navigate =
    useNavigate();

  const authUser =
    useAuth();

  if (isLoading) {
    return <div>Cargando...</div>;
  }

  if (error || !data) {
    return <div>Usuario no encontrado</div>;
  }

  const isOwner =
    authUser.user?.id ===
    data.id;

  return (
    <Container>
      <ProfileHeader
        username={data.username}
        avatar={data.avatar}
        bio={data.bio}
        createdAt={data.createdAt}
        canEdit={isOwner}
        onEdit={() =>
          navigate("/profile/edit")
        }
      />

      <ProfileStats
        mods={data.stats.mods}
        comments={
          data.stats.comments
        }
        followers={
          data.stats.followers
        }
        following={
          data.stats.following
        }
      />
    </Container>
  );
}