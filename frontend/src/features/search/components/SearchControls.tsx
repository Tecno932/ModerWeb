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
  //////////////////////////////////////////////////
  // FILTER STATE
  //////////////////////////////////////////////////

  const {
    query,
    type,
    category,
    loader,
    sort,
    setFilter,
  } = useSearchFilters();

  //////////////////////////////////////////////////
  // CONFIG
  //////////////////////////////////////////////////

  const isJava =
    platform ===
    "JAVA";

  const types = isJava
    ? JAVA_TYPES
    : BEDROCK_TYPES;

  const categories = isJava
    ? JAVA_CATEGORIES[type] || []
    : BEDROCK_CATEGORIES[type] ||
      [];

  //////////////////////////////////////////////////
  // RENDER
  //////////////////////////////////////////////////

  return (
    <div className={styles.wrapper}>
      {/* SEARCH */}

      <SearchInput
        value={query}
        onChange={(v) =>
          setFilter(
            "query",
            v
          )
        }
      />

      {/* TYPE */}

      <div className={styles.section}>
        <h3>Type</h3>

        <SearchTypeFilter
          options={types}
          value={type}
          onChange={(v) =>
            setFilter(
              "type",
              v
            )
          }
        />
      </div>

      {/* CATEGORY */}

      {!!categories.length && (
        <div
          className={styles.section}
        >
          <h3>
            Categories
          </h3>

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
        </div>
      )}
      <div className={styles.section}>
        <h3>Loader</h3>

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
      </div>

      <div className={styles.section}>
        <h3>Sort</h3>

        <select
          value={sort}
          onChange={(e) =>
            setFilter(
              "sort",
              e.target.value
            )
          }
        >
          <option value="newest">
            Newest
          </option>

          <option value="downloads">
            Downloads
          </option>

          <option value="likes">
            Likes
          </option>
        </select>
      </div>
    </div>
  );
}