interface Props {
  mods: number;
  followers: number;
  following: number;
}

import styles from "./ProfileStats.module.css";

export default function ProfileStats({
  mods,
  followers,
  following,
}: Props) {
  return (
    <div className={styles.stats}>
      <div>
        <strong>{mods}</strong>
        <span>Mods</span>
      </div>

      <div>
        <strong>{followers}</strong>
        <span>Seguidores</span>
      </div>

      <div>
        <strong>{following}</strong>
        <span>Seguidos</span>
      </div>
    </div>
  );
}