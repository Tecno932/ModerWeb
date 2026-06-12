import.meta.env.VITE_API_URL
import styles from "./index.module.css";

type Props = {
  images: any[];
};

export default function ModGallery({
  images,
}: Props) {
  if (!images?.length) {
    return null;
  }

  const API_URL =
    import.meta.env.VITE_API_URL;

  return (
    <div className={styles.gallery}>
      {images.map((img: any) => (
        <img
          key={img.id}
          src={`${API_URL}${img.url}`}
          alt=""
          className={styles.image}
        />
      ))}
    </div>
  );
}