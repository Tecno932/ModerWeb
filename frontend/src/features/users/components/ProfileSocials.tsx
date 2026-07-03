import styles from "./ProfileSocials.module.css";

interface Social {
  id: number;

  platform: string;

  url: string;
}

interface Props {
  socials: Social[];
}

function getLabel(
  platform: string
) {
  switch (platform) {
    case "GITHUB":
      return "🐙";

    case "DISCORD":
      return "🎮";

    case "YOUTUBE":
      return "▶";

    case "INSTAGRAM":
      return "📷";

    case "PATREON":
      return "❤️";

    case "KOFI":
      return "☕";

    case "TWITCH":
      return "📺";

    case "X":
      return "✖";

    case "TIKTOK":
      return "🎵";

    case "WEBSITE":
      return "🌍";

    default:
      return platform;
  }
}

export default function ProfileSocials({
  socials,
}: Props) {
  if (
    !socials ||
    socials.length === 0
  ) {
    return null;
  }

  return (
    <div className={styles.card}>
      <div
        className={
          styles.links
        }
      >
        {socials.map(
          (social) => (
            <a
              key={social.id}
              href={social.url}
              target="_blank"
              rel="noreferrer"
              className={
                styles.link
              }
            >
              {getLabel(
                social.platform
              )}
            </a>
          )
        )}
      </div>
    </div>
  );
}