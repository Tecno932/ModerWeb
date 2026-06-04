import type {
  InputHTMLAttributes,
} from "react";

import clsx from "clsx";

import styles from "./Input.module.css";

type InputProps =
  InputHTMLAttributes<HTMLInputElement> & {
    label?: string;

    hint?: string;

    error?: string;
  };

export default function Input({
  label,
  hint,
  error,
  className,
  ...props
}: InputProps) {
  return (
    <div className={styles.wrapper}>
      {label && (
        <label className={styles.label}>
          {label}
        </label>
      )}

      <input
        className={clsx(
          styles.input,
          error &&
            styles.inputError,
          className
        )}
        {...props}
      />

      {(hint || error) && (
        <p
          className={clsx(
            styles.message,
            error &&
              styles.errorMessage
          )}
        >
          {error || hint}
        </p>
      )}
    </div>
  );
}