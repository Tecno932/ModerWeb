import type {
  ButtonHTMLAttributes,
  ReactNode,
} from "react";

import clsx from "clsx";

import styles from "./Button.module.css";

type ButtonProps =
  ButtonHTMLAttributes<HTMLButtonElement> & {
    children: ReactNode;

    variant?:
      | "primary"
      | "secondary"
      | "ghost";

    loading?: boolean;
  };

export default function Button({
  children,
  variant = "primary",
  loading,
  className,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={clsx(
        styles.button,
        styles[variant],
        className
      )}
      disabled={
        disabled || loading
      }
      {...props}
    >
      {loading
        ? "Cargando..."
        : children}
    </button>
  );
}