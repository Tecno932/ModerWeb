import { useOutletContext } from "react-router-dom";

export default function GalleryTab() {
  const { mod }: any = useOutletContext();

  return (
    <div>
      <h2>Gallery</h2>

      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        {mod.images.map((img: any) => (
          <img
            key={img.id}
            src={`http://192.168.0.110:3000${img.url}`}
            style={{ width: 120, borderRadius: 8 }}
          />
        ))}
      </div>
    </div>
  );
}