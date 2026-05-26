export default function ErrorState({ message }: { message?: string }) {
  return (
    <div
      style={{
        padding: 20,
        background: "#2a1a1a",
        color: "#ffb3b3",
        borderRadius: 8,
      }}
    >
      <strong>Error:</strong> {message || "Algo salió mal"}
    </div>
  );
}