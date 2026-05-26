export default function Skeleton({ height = 20 }: { height?: number }) {
  return (
    <div
      style={{
        height,
        background: "#2a2a2a",
        borderRadius: 6,
        animation: "pulse 1.5s infinite",
      }}
    />
  );
}