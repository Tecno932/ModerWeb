import { useState } from "react";
import { timeAgo } from "@/shared/lib/timeAgo";

import { useUpdateComment } from "@/features/comments/hooks/useUpdateComment";
import { useDeleteComment } from "@/features/comments/hooks/useDeleteComment";
import ReplyForm from "./ReplyForm";
import { useCreateReply } from "@/features/comments/hooks/useCreateReply";
import ReplyItem from "./ReplyItem";

import styles from "./CommentItem.module.css";

type Props = {
  comment: any;
  modId: number;
};

export default function CommentItem({
  comment,
  modId,
}: Props) {

  console.log("COMMENT ITEM", comment);

  const [replying, setReplying] =
    useState(false);

  const [editing, setEditing] =
    useState(false);

  const [editContent, setEditContent] =
    useState(comment.content);

  const createReply =
    useCreateReply(modId);

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
    user?.id === comment.user.id;

  return (
    <article className={styles.comment}>
      <header className={styles.header}>
        <strong className={styles.username}>
          {comment.user.username}
        </strong>

        <small className={styles.date}>
          {timeAgo(
            comment.createdAt
          )}
        </small>
      </header>

      {!editing && (
        <p className={styles.content}>
          {comment.content}
        </p>
      )}

      <button className={styles.replyButton}
        onClick={() =>
          setReplying(
            !replying
          )
        }
      >
        Reply
      </button>

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
                  "Delete this comment?"
                )
              ) {
                deleteComment.mutate(
                  comment.id
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
            onChange={(e) =>
              setEditContent(
                e.target.value
              )
            }
            className={styles.editTextarea}
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
                  commentId: comment.id,
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

      {replying && (
        <ReplyForm
          loading={
            createReply.isPending
          }
          onCancel={() =>
            setReplying(false)
          }
          onSubmit={(
            content
          ) => {
            createReply.mutate({
              commentId:
                comment.id,

              content,
            });

            setReplying(false);
          }}
        />
      )}

      {comment.replies?.length >
        0 && (
        <div className={styles.replies}>
          {comment.replies.map(
            (reply: any) => (
              <ReplyItem
                key={reply.id}
                reply={reply}
                modId={modId}
              />
            )
          )}
        </div>
      )}
    </article>
  );
}