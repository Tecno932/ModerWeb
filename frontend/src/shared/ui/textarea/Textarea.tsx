import type {
  TextareaHTMLAttributes,
} from "react";

import clsx from "clsx";

import styles from "./Textarea.module.css";

type Props =
  TextareaHTMLAttributes<HTMLTextAreaElement> & {
    label?: string;

    hint?: string;

    error?: string;
  };

export default function Textarea({
  label,
  hint,
  error,
  className,
  ...props
}: Props) {
  return (
    <div className={styles.wrapper}>
      {label && (
        <label className={styles.label}>
          {label}
        </label>
      )}

      <textarea
        className={clsx(
          styles.textarea,
          error &&
            styles.textareaError,
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