import { Outlet } from "react-router-dom";

import DashboardSidebar from "@/features/dashboard/components/DashboardSidebar";

import styles from "./DashboardLayout.module.css";

export default function DashboardLayout() {
  return (
    <div className={styles.layout}>
      <DashboardSidebar />

      <main className={styles.main}>
        <div className={styles.content}>
          <Outlet />
        </div>
      </main>
    </div>
  );
}