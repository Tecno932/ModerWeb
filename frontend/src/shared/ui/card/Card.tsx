import styles from "./Card.module.css";

import type { ReactNode } from "react";
import clsx from "clsx";

type CardProps = {
  children: ReactNode;

  className?: string;

  hoverable?: boolean;

  padding?: "sm" | "md" | "lg";
};

export default function Card({
  children,
  className,
  hoverable = false,
  padding = "md",
}: CardProps) {
  return (
    <div
      className={clsx(
        styles.card,
        styles[padding],

        hoverable &&
          styles.hoverable,

        className
      )}
    >
      {children}
    </div>
  );
}