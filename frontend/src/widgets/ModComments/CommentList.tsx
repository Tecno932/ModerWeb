import CommentItem from "./CommentItem";

type Props = {
  comments: any[];
  modId: number;
};

export default function CommentList({
  comments,
  modId,
}: Props) {
  return (
    <>
      {comments.map(
        (comment) => (
          <CommentItem
            key={comment.id}
            comment={comment}
            modId={modId}
          />
        )
      )}
    </>
  );
}