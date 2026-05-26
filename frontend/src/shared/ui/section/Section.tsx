import type { ReactNode } from "react";

import styles from "./Section.module.css";

type Props = {
  title?: string;

  children: ReactNode;
};

export default function Section({
  title,
  children,
}: Props) {
  return (
    <section className={styles.section}>
      {title && (
        <h2 className={styles.title}>
          {title}
        </h2>
      )}

      {children}
    </section>
  );
}