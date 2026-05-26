import { useParams, NavLink, Outlet } from "react-router-dom";
import { useMod } from "@/features/mods/hooks";
import { useAuth } from "@/context/AuthContext";
import Skeleton from "@/shared/ui/Skeleton";

export default function ProjectDashboard() {
  const { id } = useParams();
  const { data, isLoading } = useMod(id!); // podés hacer useModById
  const { user } = useAuth();

  if (isLoading) return <Skeleton height={200} />;
  if (!data) return <div>No encontrado</div>;

  const isOwner = user?.id === data.authorId;

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      
      {/* SIDEBAR */}
      <div
        style={{
          width: 220,
          background: "#111",
          padding: 16,
          display: "flex",
          flexDirection: "column",
          gap: 10,
        }}
      >
        <h3>{data.title}</h3>

        <NavLink to={`/project/${id}`}>📊 Overview</NavLink>
        <NavLink to={`/project/${id}/versions`}>📦 Versions</NavLink>
        <NavLink to={`/project/${id}/gallery`}>🖼 Gallery</NavLink>
        <NavLink to={`/project/${id}/settings`}>⚙ Settings</NavLink>
      </div>

      {/* CONTENT */}
      <div style={{ flex: 1, padding: 20 }}>
        <Outlet context={{ mod: data, isOwner }} />
      </div>
    </div>
  );
}