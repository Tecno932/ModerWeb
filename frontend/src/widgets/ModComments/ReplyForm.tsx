import { useState } from "react";
import styles from "./ReplyForm.module.css";

type Props = {
  loading?: boolean;

  onSubmit: (
    content: string
  ) => void;

  onCancel: () => void;
};

export default function ReplyForm({
  loading,
  onSubmit,
  onCancel,
}: Props) {
  const [content, setContent] =
    useState("");

  const handleSubmit = (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    const value =
      content.trim();

    if (!value) return;

    onSubmit(value);

    setContent("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={styles.form}
    >
      <textarea
        rows={3}
        value={content}
        className={styles.textarea}
        onChange={(e) =>
          setContent(
            e.target.value
          )
        }
        placeholder="Write a reply..."
      />

      <div className={styles.actions} >
        <button
          type="button"
          className={styles.button}
          onClick={
            onCancel
          }
        >
          Cancel
        </button>

        <button
          type="submit"
          className={styles.button}
          disabled={loading}
        >
          Reply
        </button>
      </div>
    </form>
  );
}