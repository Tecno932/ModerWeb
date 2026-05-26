export default function ModGallery({ images }: any) {
  if (!images?.length) return null;

  const BASE = "http://192.168.0.110:3000";
  
  return (
    <div style={{ display: "flex", gap: 10, overflowX: "auto" }}>
      {images.map((img: any) => (
        <img
          key={img.id}
          src={BASE + img.url}
          style={{
            width: 200,
            height: 120,
            objectFit: "cover",
            borderRadius: 8,
          }}
        />
      ))}
    </div>
  );
}