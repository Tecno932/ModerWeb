import styles
  from "./ProfileCosmetics.module.css";

interface Props {
  cosmetics: any[];
}

export default function ProfileCosmetics({
  cosmetics,
}: Props) {
  if (
    cosmetics.length === 0
  ) {
    return null;
  }

  return (
    <div
      className={
        styles.container
      }
    >
      <h2>
        Cosméticos Equipados
      </h2>

      <div
        className={
          styles.grid
        }
      >
        {cosmetics.map(
          (item) => (
            <div
              key={item.id}
              className={
                styles.card
              }
            >
              <img
                src={
                  item.cosmetic
                    .imageUrl
                }
                alt={
                  item.cosmetic
                    .name
                }
              />

              <h3>
                {
                  item.cosmetic
                    .name
                }
              </h3>

              <span>
                {
                  item.type
                }
              </span>
            </div>
          )
        )}
      </div>
    </div>
  );
}