import { useState } from "react";
import styles from "./CommentForm.module.css";

type Props = {
  onSubmit: (
    content: string
  ) => void;

  loading?: boolean;
};

export default function CommentForm({
  onSubmit,
  loading,
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
    className={styles.form}
    onSubmit={handleSubmit}
    >
      <textarea
        value={content}
        className={styles.textarea}
        onChange={(e) =>
          setContent(
            e.target.value
          )
        }
        placeholder="Write a comment..."
        rows={4}
      />

      <button
        type="submit"
        className={styles.button}
        disabled={loading}
      >
        Post Comment
      </button>
    </form>
  );
}