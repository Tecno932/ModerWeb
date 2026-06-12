import { useParams } from "react-router-dom";
import { useState } from "react";
import { useMod } from "../hooks";

import ModHero from "@/widgets/ModHero";
import ModSidebar from "@/widgets/ModSidebar";

import ModDescription from "@/widgets/ModDescription";
import ModGallery from "@/widgets/ModGallery";
import ModVersions from "@/widgets/ModVersions";
import ModComments from "@/widgets/ModComments";
import { useVersions } from "@/features/upload-version/hooks";

import Skeleton from "@/shared/ui/Skeleton";
import ErrorState from "@/shared/ui/ErrorState";

import styles from "./ModPage.module.css";

export default function ModPage() {
  const { slug } = useParams();

  const { data, isLoading, error } = useMod(slug!);

  const { data: versions } =
    useVersions(data?.id || "");

  const [tab, setTab] = useState<
    "description" |
    "gallery" |
    "versions" |
    "comments"
  >("description");

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
  console.log("CONTENT:", data.content);
  console.log("TYPE:", typeof data.content);

  return (
    <div className={styles.page}>
      <div className={styles.layout}>
        <main className={styles.main}>
          <ModHero mod={data} />

          <div className={styles.tabs}>
            <button
              className={
                tab === "description"
                  ? styles.activeTab
                  : ""
              }
              onClick={() =>
                setTab("description")
              }
            >
              Description
            </button>

            <button
              className={
                tab === "gallery"
                  ? styles.activeTab
                  : ""
              }
              onClick={() =>
                setTab("gallery")
              }
            >
              Gallery
            </button>

            <button
              className={
                tab === "versions"
                  ? styles.activeTab
                  : ""
              }
              onClick={() =>
                setTab("versions")
              }
            >
              Versions
            </button>

            <button
              className={
                tab === "comments"
                  ? styles.activeTab
                  : ""
              }
              onClick={() =>
                setTab("comments")
              }
            >
              Comments ({data.stats.comments})
            </button>
          </div>


            {tab === "description" && (
              <ModDescription
                content={data.content}
                description={data.description}
              />
            )}

            {tab === "gallery" && (
              <section className={styles.section}>
                <ModGallery images={data.images} />
              </section>
            )}

            {tab === "versions" && (
              <ModVersions
                versions={versions || []}
                modId={data.id}
              />
            )}

            {tab === "comments" && (
              <ModComments
                modId={data.id}
              />
            )}
          </main>

        <ModSidebar mod={data} />
      </div>
    </div>
  );
}