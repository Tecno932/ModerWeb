import { logout } from "@/context/AuthContext";

import { useAuth } from "@/context/AuthContext";

import styles from "./UserMenu.module.css";

export default function UserMenu() {
  const { user } = useAuth();

  return (
    <div className={styles.menu}>
      <div className={styles.avatar}>
        {user?.username?.[0]}
      </div>

      <button onClick={logout}>
        Logout
      </button>
    </div>
  );
}