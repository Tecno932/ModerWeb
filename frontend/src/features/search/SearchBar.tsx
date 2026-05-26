import {
  useEffect,
  useState,
} from "react";

import {
  useSearchParams,
} from "react-router-dom";

import styles from "./SearchBar.module.css";

export default function SearchBar() {
  const [params, setParams] =
    useSearchParams();

  const [value, setValue] =
    useState(
      params.get("q") || ""
    );

  //////////////////////////////////////////////////
  // DEBOUNCE
  //////////////////////////////////////////////////

  useEffect(() => {
    const timeout =
      setTimeout(() => {
        const next =
          new URLSearchParams(
            params
          );

        if (value) {
          next.set("q", value);
        } else {
          next.delete("q");
        }

        setParams(next);
      }, 400);

    return () =>
      clearTimeout(timeout);
  }, [value]);

  return (
    <input
      value={value}
      onChange={(e) =>
        setValue(
          e.target.value
        )
      }
      placeholder="Search mods..."
      className={styles.input}
    />
  );
}