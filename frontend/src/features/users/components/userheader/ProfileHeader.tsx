import styles from "./ProfileHeader.module.css";
interface Props {
  username:    string;
  displayName: string | null;
  bio:         string | null;
  avatarUrl:   string | null;
  bannerUrl:   string | null;
  createdAt:   string;

  canEdit?:    boolean;
  onEdit?: ()  => void;

  stats?:      React.ReactNode;
  socials?:    React.ReactNode;

  actionButton?: React.ReactNode;
}

export default function ProfileHeader({
  username,
  displayName,
  bio,
  avatarUrl,
  bannerUrl,
  canEdit,
  onEdit,
  stats,
  socials,
  actionButton,
}: Props) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.banner}>
        {bannerUrl && <img src={bannerUrl} alt="Banner" />}
      </div>

        <div className={styles.overlay}>

          {/* TOP: avatar + name */}
          <div className={styles.top}>
            <div className={styles.avatar}>
              {avatarUrl ? (
                <img src={avatarUrl} alt={username} />
              ) : (
                username.charAt(0).toUpperCase()
              )}
            </div>

            <div className={styles.mainInfo}>
              <div className={styles.nameRow}>
                <p className={styles.name}>
                  {displayName ?? username}
                </p>

                {actionButton}
              </div>

              {stats && (
                <div className={styles.stats}>
                  {stats}
                </div>
              )}

              {socials && (
                <div className={styles.socials}>
                  {socials}
                </div>
              )}
            </div>

          {/* BIO */}
          </div>
          <div className={styles.bio}>
            {bio ?? "Este usuario todavía no agregó una biografía."}
          </div>

          {canEdit && (
            <button className={styles.editButton} onClick={onEdit}>
              Editar perfil
            </button>
          )}

        </div>
    </div>
  );
}