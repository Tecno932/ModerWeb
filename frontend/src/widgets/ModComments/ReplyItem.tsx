import { useState } from "react";

import { timeAgo } from "@/shared/lib/timeAgo";

import { useUpdateComment } from "@/features/comments/hooks/useUpdateComment";
import { useDeleteComment } from "@/features/comments/hooks/useDeleteComment";

import styles from "./CommentItem.module.css";

type Props = {
  reply: any;
  modId: number;
};

export default function ReplyItem({
  reply,
  modId,
}: Props) {
  const [editing, setEditing] =
    useState(false);

  const [editContent, setEditContent] =
    useState(reply.content);

  const updateComment =
    useUpdateComment(modId);

  const deleteComment =
    useDeleteComment(modId);

  const storedUser =
    localStorage.getItem("user");

  const user =
    storedUser
      ? JSON.parse(storedUser)
      : null;

  const isOwner =
    user?.id === reply.user.id;

  return (
    <article className={styles.reply}>
      <strong className={styles.username}>
        {reply.user.username}
      </strong>

      <small className={styles.date}>
        {timeAgo(reply.createdAt)}
      </small>

      {!editing && (
        <p className={styles.content}>
          {reply.content}
        </p>
      )}

      {isOwner && (
        <>
          <button
            className={styles.actionButton}
            onClick={() =>
              setEditing(!editing)
            }
          >
            Edit
          </button>

          <button
            className={styles.deleteButton}
            onClick={() => {
              if (
                confirm(
                  "Delete this reply?"
                )
              ) {
                deleteComment.mutate(
                  reply.id
                );
              }
            }}
          >
            Delete
          </button>
        </>
      )}

      {editing && (
        <div className={styles.editBox}>
          <textarea
            value={editContent}
            className={
              styles.editTextarea
            }
            onChange={(e) =>
              setEditContent(
                e.target.value
              )
            }
          />

          <div
            className={styles.editActions}
          >
            <button
              onClick={() =>
                setEditing(false)
              }
            >
              Cancel
            </button>

            <button
              onClick={() => {
                const value =
                  editContent.trim();

                if (!value) return;

                updateComment.mutate({
                  commentId:
                    reply.id,
                  content: value,
                });

                setEditing(false);
              }}
            >
              Save
            </button>
          </div>
        </div>
      )}
    </article>
  );
}