import {
  useEffect,
  useRef,
  useState,
} from "react";

import SearchInput from "./SearchInput";
import SearchTypeFilter from "./SearchTypeFilter";

import {
  JAVA_TYPES,
  JAVA_CATEGORIES,
} from "../config/javaFilters";

import {
  BEDROCK_TYPES,
  BEDROCK_CATEGORIES,
} from "../config/bedrockFilters";

import CollapsibleFilter from "./CollapsibleFilter";

import { useSearchFilters } from "../hooks/useSearchFilters";

import styles from "./SearchControls.module.css";

type Props = {
  platform:
    | "JAVA"
    | "BEDROCK";
};

export default function SearchControls({
  platform,
}: Props) {
  const {
    query,
    type,
    category,
    loader,
    version,
    setFilter,
  } = useSearchFilters();

  const isJava =
    platform === "JAVA";

  const types = isJava
    ? JAVA_TYPES
    : BEDROCK_TYPES;

  const categories = isJava
    ? JAVA_CATEGORIES[type] || []
    : BEDROCK_CATEGORIES[type] ||
      [];

  const versions = [
    "1.21.6",
    "1.21.5",
    "1.21.4",
    "1.21.3",
    "1.21.2",
    "1.21.1",
    "1.21",
    "1.20.6",
    "1.20.5",
    "1.20.4",
    "1.20.3",
    "1.20.2",
    "1.20.1",
    "1.20",
    "1.19.4",
    "1.19.3",
    "1.19.2",
    "1.19.1",
    "1.19",
  ];

  const [mobileOpen, setMobileOpen] =
    useState<string | null>(null);

  const wrapperRef =
    useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (
      e: MouseEvent
    ) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(
          e.target as Node
        )
      ) {
        setMobileOpen(null);
      }
    };

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () =>
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
  }, []);

  return (
    <div className={styles.wrapper}>
      <SearchInput
        value={query}
        onChange={(v) =>
          setFilter("query", v)
        }
      />

      {/* MOBILE */}

      <div
        className={styles.mobileFilters}
        ref={wrapperRef}
      >
        <button
          className={styles.mobileButton}
          onClick={() =>
            setMobileOpen(
              mobileOpen === "type"
                ? null
                : "type"
            )
          }
        >
          Type
        </button>

        <button
          className={styles.mobileButton}
          onClick={() =>
            setMobileOpen(
              mobileOpen ===
                "category"
                ? null
                : "category"
            )
          }
        >
          Category
        </button>

        <button
          className={styles.mobileButton}
          onClick={() =>
            setMobileOpen(
              mobileOpen ===
                "loader"
                ? null
                : "loader"
            )
          }
        >
          Loader
        </button>

        <button
          className={styles.mobileButton}
          onClick={() =>
            setMobileOpen(
              mobileOpen ===
                "version"
                ? null
                : "version"
            )
          }
        >
          Version
        </button>

        {mobileOpen === "type" && (
          <div className={styles.mobileDropdown}>
            <SearchTypeFilter
              options={types}
              value={type}
              onChange={(v) => {
                setFilter("type", v);
                setMobileOpen(null);
              }}
            />
          </div>
        )}

        {mobileOpen ===
          "category" &&
          !!categories.length && (
            <div
              className={
                styles.mobileDropdown
              }
            >
              <SearchTypeFilter
                options={categories}
                value={category}
                onChange={(v) => {
                  setFilter(
                    "category",
                    v
                  );

                  setMobileOpen(null);
                }}
              />
            </div>
          )}

        {mobileOpen ===
          "loader" && (
          <div className={styles.mobileDropdown}>
            <SearchTypeFilter
              options={[
                "FABRIC",
                "FORGE",
                "NEOFORGE",
                "QUILT",
              ]}
              value={loader}
              onChange={(v) => {
                setFilter(
                  "loader",
                  v
                );

                setMobileOpen(null);
              }}
            />
          </div>
        )}

        {mobileOpen ===
          "version" && (
          <div className={styles.mobileDropdown}>
            <SearchTypeFilter
              options={versions}
              value={version}
              onChange={(v) => {
                setFilter(
                  "version",
                  v
                );

                setMobileOpen(null);
              }}
            />
          </div>
        )}
      </div>

      {/* DESKTOP */}

      <div
        className={
          styles.desktopFilters
        }
      >
        <CollapsibleFilter title="Type">
          <SearchTypeFilter
            options={types}
            value={type}
            onChange={(v) =>
              setFilter("type", v)
            }
          />
        </CollapsibleFilter>

        {!!categories.length && (
          <CollapsibleFilter title="Category">
            <SearchTypeFilter
              options={categories}
              value={category}
              onChange={(v) =>
                setFilter(
                  "category",
                  v
                )
              }
            />
          </CollapsibleFilter>
        )}

        <CollapsibleFilter title="Loader">
          <SearchTypeFilter
            options={[
              "FABRIC",
              "FORGE",
              "NEOFORGE",
              "QUILT",
            ]}
            value={loader}
            onChange={(v) =>
              setFilter(
                "loader",
                v
              )
            }
          />
        </CollapsibleFilter>

        <CollapsibleFilter title="Version">
          <SearchTypeFilter
            options={versions}
            value={version}
            onChange={(v) =>
              setFilter(
                "version",
                v
              )
            }
          />
        </CollapsibleFilter>
      </div>
    </div>
  );
}