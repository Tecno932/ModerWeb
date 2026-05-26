import { useParams } from "react-router-dom";
import { useMod } from "../hooks";

import ModHeader from "@/widgets/ModHeader";
import ModGallery from "@/widgets/ModGallery";
import VersionsTable from "@/widgets/VersionsTable";
import { useVersions } from "@/features/upload-version/hooks";
import UploadVersionForm from "@/features/upload-version/components/UploadVersionForm";

import Skeleton from "@/shared/ui/Skeleton";
import ErrorState from "@/shared/ui/ErrorState";

import { useAuth } from "@/context/AuthContext";

export default function ModPage() {
  const { slug } = useParams();
  const { user } = useAuth();

  const { data, isLoading, error } = useMod(slug!);
  console.log("MOD DATA:", data);

  const { data: versions } =
    useVersions(data?.id || "");

  if (isLoading)
    return (
      <div style={{ padding: 20 }}>
        <Skeleton height={40} />
        <Skeleton height={200} />
        <Skeleton height={100} />
      </div>
    );

  if (error) return <ErrorState message="No se pudo cargar el mod" />;
  if (!data) return <div>Mod no encontrado</div>;

  const isOwner = user?.id === data.authorId;

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: 20 }}>
      <ModHeader mod={data} />

      <div style={{ marginTop: 20 }}>
        <ModGallery images={data.images} />
      </div>

      <div style={{ marginTop: 20 }}>
        <p>{data.description}</p>
      </div>

      {data.content && (
        <div style={{ marginTop: 20 }}>
          <div dangerouslySetInnerHTML={{ __html: data.content }} />
        </div>
      )}

      <div style={{ marginTop: 30 }}>
      <VersionsTable
        versions={versions || []}
        modId={data.id}
        isOwner={isOwner}
      />
      </div>
      
      {isOwner && (
        <div style={{ marginTop: 40 }}>
          <h2>Subir nueva versión</h2>
          {data?.id && <UploadVersionForm modId={data.id} />}
        </div>
      )}
    </div>
  );
}