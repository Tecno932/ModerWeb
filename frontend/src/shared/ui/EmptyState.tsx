export default function EmptyState({ message }: { message: string }) {
  return (
    <div
      style={{
        padding: 30,
        textAlign: "center",
        opacity: 0.6,
      }}
    >
      {message}
    </div>
  );
}