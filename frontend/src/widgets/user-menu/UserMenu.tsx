import { useAuth } from "@/features/auth/context/AuthContext";

import styles from "./UserMenu.module.css";

export default function UserMenu() {
  const { user } = useAuth();
  const { logout } = useAuth();

  return (
    <div className={styles.menu}>
      <div className={styles.avatar}>
        {user?.username?.[0]}
      </div>

        <button
          onClick={logout}
        >
          Salir
        </button>
    </div>
  );
}