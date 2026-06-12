import { useMemo } from "react";

import {
  useSearchParams,
} from "react-router-dom";

import { useMods } from "@/features/mods/hooks";

import SearchControls from "@/features/search/components/SearchControls";

import ModCard from "@/widgets/mod-card/ModCard";

import Container from "@/shared/ui/container/Container";

import Skeleton from "@/shared/ui/Skeleton";
import ErrorState from "@/shared/ui/ErrorState";
import EmptyState from "@/shared/ui/EmptyState";

import styles from "./SearchPage.module.css";

type Props = {
  platform:
    | "JAVA"
    | "BEDROCK";

  title: string;
};

export default function SearchPage({
  platform,
  title,
}: Props) {
  //////////////////////////////////////////////////
  // URL PARAMS
  //////////////////////////////////////////////////

  const [params] =
    useSearchParams();

  //////////////////////////////////////////////////
  // FILTERS
  //////////////////////////////////////////////////

  const query =
    params.get("query") || "";

  const type =
    params.get("type") || "";

  const category =
    params.get(
      "category"
    ) || "";

  const loader =
    params.get("loader") || "";

  const version =
    params.get("version") || "";

  //////////////////////////////////////////////////
  // QUERY PARAMS
  //////////////////////////////////////////////////

  const searchParams =
    useMemo(
      () => ({
        page: 1,

        platform,

        query,

        type,

        category,

        loader,

        version,
      }),

      [
        platform,
        query,
        type,
        category,
        loader,
        version,
      ]
    );

  //////////////////////////////////////////////////
  // API
  //////////////////////////////////////////////////

  const {
    data,
    isLoading,
    error,
  } = useMods(
    searchParams
  );

  //////////////////////////////////////////////////
  // RENDER
  //////////////////////////////////////////////////

  return (
    <Container>
      <div className={styles.header}>
        <h1 className={styles.title}>
          {title}
        </h1>

        <p className={styles.subtitle}>
          Explore community-made content
        </p>
      </div>

      <div className={styles.page}>
        <aside className={styles.sidebar}>
          <SearchControls
            platform={platform}
          />
        </aside>

        <main className={styles.content}>
          {isLoading && (
            <div className={styles.list}>
              {Array.from({
                length: 8,
              }).map((_, i) => (
                <Skeleton
                  key={i}
                  height={180}
                />
              ))}
            </div>
          )}

          {error && (
            <ErrorState message="Failed to load mods" />
          )}

          {!isLoading &&
            !error &&
            !data?.data?.length && (
              <EmptyState message="No projects found" />
            )}

          {!!data?.data?.length && (
            <>
              <div className={styles.results}>
                {data.meta.total} results
              </div>

              <div className={styles.list}>
                {data.data.map(
                  (mod: any) => (
                    <ModCard
                      key={mod.id}
                      mod={mod}
                    />
                  )
                )}
              </div>
            </>
          )}
        </main>
      </div>
    </Container>
  );
}