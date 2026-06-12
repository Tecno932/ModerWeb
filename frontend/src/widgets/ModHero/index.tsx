import styles from "./index.module.css";

type Props = {
  mod: any;
};

export default function ModHero({
  mod,
}: Props) {

  return (
    <div className={styles.hero}>
      <div className={styles.header}>
        <img
          src={`${import.meta.env.VITE_API_URL}${mod.icon}`}
          alt={mod.title}
          className={styles.cover}
        />

        <div className={styles.content}>
          <h1>{mod.title}</h1>

          {mod.summary && (
            <p className={styles.summary}>
              {mod.summary}
            </p>
          )}
        </div>
      </div>

      <p className={styles.description}>
        {mod.description}
      </p>
    </div>
  );
}