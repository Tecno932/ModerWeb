import type { ReactNode } from "react";

import styles from "./Badge.module.css";

type BadgeProps = {
  children: ReactNode;
};

export default function Badge({
  children,
}: BadgeProps) {
  return (
    <span className={styles.badge}>
      {children}
    </span>
  );
}