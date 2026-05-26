import {
  useNavigate,
  useSearchParams,
} from "react-router-dom";

import {
  useEffect,
  useRef,
  useState,
} from "react";

import { useDebounce } from "@/features/search/lib/useDebounce";

import { useMods } from "@/features/mods/hooks";

import SearchResultCard from "@/widgets/search-result-card/SearchResultCard";

import styles from "./NavbarSearch.module.css";

export default function NavbarSearch() {
  const navigate =
    useNavigate();

  const [searchParams] =
    useSearchParams();

  //////////////////////////////////////////////////
  // STATE
  //////////////////////////////////////////////////

  const [value, setValue] =
    useState(
      searchParams.get(
        "query"
      ) || ""
    );

  const [focused, setFocused] =
    useState(false);

  const wrapperRef =
    useRef<HTMLDivElement>(null);

  //////////////////////////////////////////////////
  // DEBOUNCE
  //////////////////////////////////////////////////

  const debounced =
    useDebounce(value, 400);

  //////////////////////////////////////////////////
  // SEARCH
  //////////////////////////////////////////////////

  const { data } = useMods({
    page: 1,
    query: debounced,
    limit: 6,
  });

  //////////////////////////////////////////////////
  // AUTO SEARCH PAGE SYNC
  //////////////////////////////////////////////////

  useEffect(() => {
    if (
      window.location.pathname !==
      "/search"
    ) {
      return;
    }

    navigate(
      `/search?query=${encodeURIComponent(
        debounced
      )}`,
      {
        replace: true,
      }
    );
  }, [debounced]);

  //////////////////////////////////////////////////
  // OUTSIDE CLICK
  //////////////////////////////////////////////////

  useEffect(() => {
    function handleClick(
      e: MouseEvent
    ) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(
          e.target as Node
        )
      ) {
        setFocused(false);
      }
    }

    document.addEventListener(
      "mousedown",
      handleClick
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClick
      );
    };
  }, []);

  //////////////////////////////////////////////////
  // SUBMIT
  //////////////////////////////////////////////////

  function handleSubmit(
    e: React.FormEvent
  ) {
    e.preventDefault();

    navigate(
      `/search?query=${encodeURIComponent(
        value
      )}`
    );

    setFocused(false);
  }

  //////////////////////////////////////////////////
  // RESULTS
  //////////////////////////////////////////////////

  const results =
    data?.data || [];

  return (
    <div
      className={styles.wrapper}
      ref={wrapperRef}
    >
      <form
        onSubmit={handleSubmit}
        className={styles.form}
      >
        <input
          className={styles.input}
          type="text"
          placeholder="Search mods..."
          value={value}
          onFocus={() =>
            setFocused(true)
          }
          onChange={(e) =>
            setValue(
              e.target.value
            )
          }
        />
      </form>

      {focused &&
        debounced &&
        results.length > 0 && (
          <div
            className={
              styles.results
            }
          >
            {results.map(
              (mod: any) => (
                <SearchResultCard
                  key={mod.id}
                  mod={mod}
                />
              )
            )}
          </div>
        )}
    </div>
  );
}