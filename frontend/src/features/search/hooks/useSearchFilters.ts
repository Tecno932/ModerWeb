import {
  useSearchParams,
} from "react-router-dom";

export function useSearchFilters() {
  const [
    params,
    setParams,
  ] = useSearchParams();

  function setFilter(
    key: string,
    value: string
  ) {
    const next =
      new URLSearchParams(
        params
      );

    if (!value || value === "all") {
      next.delete(key);
    } else {
      next.set(key, value);
    }

    setParams(next);
  }

  return {
    query:
      params.get("query") || "",

    type:
      params.get("type") || "all",

    category:
      params.get("category") ||
      "",

    loader:
      params.get("loader") || "",

    version:
      params.get("version") ||
      "",

    sort:
      params.get("sort") ||
      "newest",

    setFilter,
  };
}