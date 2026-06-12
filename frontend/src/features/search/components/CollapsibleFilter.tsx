import { useState } from "react";

import {
  ChevronDown,
  ChevronRight,
} from "lucide-react";

import styles from "./CollapsibleFilter.module.css";

type Props = {
  title: string;

  children: React.ReactNode;
};

export default function CollapsibleFilter({
  title,
  children,
}: Props) {
  const [open, setOpen] =
    useState(true);

  return (
    <div className={styles.wrapper}>
      <button
        className={styles.header}
        onClick={() =>
          setOpen(!open)
        }
      >
        {open ? (
          <ChevronDown size={16} />
        ) : (
          <ChevronRight size={16} />
        )}

        {title}
      </button>

      {open && (
        <div className={styles.body}>
          {children}
        </div>
      )}
    </div>
  );
}