import { Outlet } from "react-router-dom";

import Navbar from "@/widgets/navbar/Navbar";

import styles from "./AppLayout.module.css";

export default function AppLayout() {
  return (
    <div className={styles.layout}>
      <Navbar />

      <main className={styles.content}>
        <Outlet />
      </main>
    </div>
  );
}