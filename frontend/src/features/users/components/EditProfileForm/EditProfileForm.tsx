import ImageUploader from "@/shared/components/ImageUploader/ImageUploader";

import styles from "../userheader/ProfileHeader.module.css";

interface FormData {
  username: string;
  displayName: string;
  bio: string;
  avatarUrl: string;
  bannerUrl: string;
  accentColor: string;
}

interface Props {
  form: FormData;
  setForm: React.Dispatch<React.SetStateAction<FormData>>;

  loading?: boolean;
  stats?: React.ReactNode;
  socials?: React.ReactNode;

  onSubmit: (data: FormData) => Promise<void>;
}

export default function EditProfileHeader({
  form,
  setForm,
  loading,
  stats,
  socials,
  onSubmit,
}: Props) {

  function updateField(
    field: keyof FormData,
    value: string
  ) {
    console.log(field, value);

    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  async function handleSubmit(
    e: React.FormEvent
  ) {
    e.preventDefault();

    await onSubmit(form);
  }

  return (
    <form
      className={styles.wrapper}
      onSubmit={handleSubmit}
    >
      {/* Banner */}
      <ImageUploader
        folder="banners"
        className={styles.banner}
        onChange={(url) => updateField("bannerUrl", url)}
      >
        {form.bannerUrl && (
          <img
            src={form.bannerUrl}
            alt="Banner"
            draggable={false}
          />
        )}
      </ImageUploader>

      <div className={styles.overlay}>
        <div className={styles.top}>
          {/* Avatar */}

          <ImageUploader
            folder="avatars"
            className={styles.avatar}
            onChange={(url) => updateField("avatarUrl", url)}
          >
            <img
              src={form.avatarUrl || "/default-avatar.png"}
              alt={form.username}
              draggable={false}
            />
          </ImageUploader>

          {/* Información */}

          <div className={styles.mainInfo}>
            <div className={styles.nameRow}>
              <input
                autoComplete="off"
                className={styles.nameInput}
                value={form.displayName}
                placeholder="Nombre"
                maxLength={40}
                onChange={(e) =>
                  updateField(
                    "displayName",
                    e.target.value
                  )
                }
              />

              <button
                type="submit"
                className={styles.editButton}
                disabled={loading}
              >
                {loading
                  ? "Guardando..."
                  : "Guardar"}
              </button>
            </div>

            <div className={styles.counter}>
              {form.displayName.length}/40
            </div>

            <div className={styles.usernameRow}>
              <input
                autoComplete="off"
                className={styles.usernameInput}
                value={form.username}
                placeholder="username"
                maxLength={24}
                onChange={(e) =>
                  updateField(
                    "username",
                    e.target.value
                  )
                }
              />
            </div>

            <div className={styles.counter}>
              {form.username.length}/24
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
        </div>

        <textarea
          autoComplete="off"
          className={styles.bioInput}
          rows={4}
          maxLength={220}
          placeholder="Contale algo a la comunidad..."
          value={form.bio}
          onChange={(e) =>
            updateField(
              "bio",
              e.target.value
            )
          }
        />

        <div className={styles.counter}>
          {form.bio.length}/220
        </div>
      </div>
    </form>
  );
}