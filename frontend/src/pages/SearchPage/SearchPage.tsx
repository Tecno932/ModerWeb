import { useMemo } from "react";

import {
  useSearchParams,
} from "react-router-dom";

import { useMods } from "@/features/mods/hooks";

import SearchControls from "@/features/search/components/SearchControls";

import ModCard from "@/widgets/mod-card/ModCard";

import Container from "@/shared/ui/container/Container";
import Section from "@/shared/ui/section/Section";

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
    params.get("version") ||
    "";

  const sort =
    params.get("sort") ||
    "newest";

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

        sort,
      }),

      [
        platform,
        query,
        type,
        category,
        loader,
        version,
        sort,
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
      {/* HEADER */}

      <div className={styles.hero}>
        <h1>{title}</h1>

        <p>
          Explore community-made
          content
        </p>
      </div>

      {/* FILTERS */}

      <SearchControls
        platform={platform}
      />

      {/* LOADING */}

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

      {/* ERROR */}

      {error && (
        <ErrorState message="Failed to load mods" />
      )}

      {/* EMPTY */}

      {!isLoading &&
        !error &&
        !data?.data?.length && (
          <EmptyState message="No projects found" />
        )}

      {/* RESULTS */}

      {!!data?.data?.length && (
        <Section
          title={`${data.meta.total} results`}
        >
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
        </Section>
      )}
    </Container>
  );
}