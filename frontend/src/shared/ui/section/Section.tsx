import type { ReactNode } from "react";

import clsx from "clsx";

import styles from "./Section.module.css";

type SectionProps = {
  title?: string;

  description?: string;

  children: ReactNode;

  className?: string;
};

export default function Section({
  title,
  description,
  children,
  className,
}: SectionProps) {
  return (
    <section
      className={clsx(
        styles.section,
        className
      )}
    >
      {(title ||
        description) && (
        <div
          className={
            styles.header
          }
        >
          {title && (
            <h2
              className={
                styles.title
              }
            >
              {title}
            </h2>
          )}

          {description && (
            <p
              className={
                styles.description
              }
            >
              {description}
            </p>
          )}
        </div>
      )}

      <div className={styles.content}>
        {children}
      </div>
    </section>
  );
}