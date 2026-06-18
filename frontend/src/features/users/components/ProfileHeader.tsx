import styles from "./ProfileHeader.module.css";

interface Props {
  username: string;
  bio: string | null;
  avatar: string | null;
  createdAt: string;

  canEdit?: boolean;
  onEdit?: () => void;
}

export default function ProfileHeader({
  username,
  bio,
  avatar,
  createdAt,
  canEdit,
  onEdit,
}: Props) {
  const memberSince =
    new Date(
      createdAt
    ).toLocaleDateString();

  return (
    <div className={styles.header}>
      <div className={styles.avatar}>
        {avatar ? (
          <img
            src={avatar}
            alt={username}
          />
        ) : (
          username
            .charAt(0)
            .toUpperCase()
        )}
      </div>

      <h1>{username}</h1>

      <p className={styles.bio}>
        {bio ??
          "No biography yet."}
      </p>

      <span
        className={
          styles.memberSince
        }
      >
        Member since {memberSince}
      </span>
      
      {canEdit && (
        <button
          className={
            styles.editButton
          }
          onClick={onEdit}
        >
          Edit Profile
        </button>
      )}
    </div>
  );
}