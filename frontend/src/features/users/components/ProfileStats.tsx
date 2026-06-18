interface Props {
  mods: number;
  comments: number;
  followers: number;
  following: number;
}

import styles from "./ProfileStats.module.css";

export default function ProfileStats({
  mods,
  comments,
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
        <strong>{comments}</strong>
        <span>Comments</span>
      </div>

      <div>
        <strong>{followers}</strong>
        <span>Followers</span>
      </div>

      <div>
        <strong>{following}</strong>
        <span>Following</span>
      </div>
    </div>
  );
}