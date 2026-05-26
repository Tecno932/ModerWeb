import { Link } from "react-router-dom";

import Container from "@/shared/ui/container/Container";

import styles from "./HomePage.module.css";

export default function HomePage() {
  return (
    <Container>
      <div className={styles.hero}>
        <h1 className={styles.title}>
          Discover Minecraft Content
        </h1>

        <p className={styles.subtitle}>
          Explore mods, addons,
          shaders, resource packs
          and worlds from the
          community.
        </p>

        <div className={styles.actions}>
          <Link
            to="/minecraft"
            className={
              styles.javaButton
            }
          >
            Minecraft Java
          </Link>

          <Link
            to="/minecraftbedrock"
            className={
              styles.bedrockButton
            }
          >
            Minecraft Bedrock
          </Link>
        </div>
      </div>
    </Container>
  );
}