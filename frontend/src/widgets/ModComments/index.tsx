import { useComments } from "@/features/comments/hooks/useComments";

import { useCreateComment } from "@/features/comments/hooks/useCreateComment";

import CommentForm from "./CommentForm";
import CommentList from "./CommentList";

import styles from "./index.module.css";

type Props = {
  modId: number;
};

export default function ModComments({
  modId,
}: Props) {
  const {
    data,
    isLoading,
    error,
  } = useComments(modId);

  console.log("COMMENTS", data);
  console.log("ERROR", error);

  const createComment =
    useCreateComment(modId);

  if (isLoading) {
    console.log("COMMENTS", data);
    return (
      <section className={styles.wrapper}>
        <h2 className={styles.title}>
          Comments
        </h2>
        <p>Cargando...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className={styles.wrapper}>
        <h2 className={styles.title}>
          Comments ({data?.length || 0})
        </h2>
        <p className={styles.empty}>
          Error cargando comentarios
        </p>
      </section>
    );
  }

  return (
    <section className={styles.wrapper}>
      <h2>
        Comments (
        {data?.length || 0}
        )
      </h2>

      <CommentForm
        loading={
          createComment.isPending
        }
        onSubmit={(
          content
        ) =>
          createComment.mutate(
            content
          )
        }
      />

      {data?.length ===
        0 && (
        <p className={styles.empty}>
          No comments yet
        </p>
      )}

      <CommentList
        comments={
          data || []
        }
        modId={modId}
        />
    </section>
  );
}