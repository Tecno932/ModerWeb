import { useMemo, useState } from "react";

import {
  NavLink,
  useNavigate,
} from "react-router-dom";

import {
  FolderGit2,
  LayoutDashboard,
  PlusSquare,
  Settings,
  Library,
  Menu,
  X,
} from "lucide-react";

import styles from "./DashboardSidebar.module.css";

export default function DashboardSidebar() {
  const [mobileOpen, setMobileOpen] =
    useState(false);

  const navigate = useNavigate();

  const user = JSON.parse(
    localStorage.getItem("user") || "{}"
  );

  //////////////////////////////////////////////////
  // NAV ITEMS
  //////////////////////////////////////////////////

  const navItems = useMemo(
    () => [
      {
        label: "Dashboard",
        path: "/dashboard",
        icon: LayoutDashboard,
      },

      {
        label: "Collections",
        path: "/collections",
        icon: Library,
      },

      {
        label: "Projects",
        path: "/project",
        icon: FolderGit2,
      },

      {
        label: "Create",
        path: "/create",
        icon: PlusSquare,
      },

      {
        label: "Settings",
        path: "/settings",
        icon: Settings,
      },
    ],
    []
  );

  //////////////////////////////////////////////////
  // CLOSE MOBILE
  //////////////////////////////////////////////////

  const closeMobile = () =>
    setMobileOpen(false);

  //////////////////////////////////////////////////
  // RENDER
  //////////////////////////////////////////////////

  return (
    <>
      {/* MOBILE TOPBAR */}
      <header className={styles.mobileHeader}>
        <button
          className={styles.mobileButton}
          onClick={() =>
            setMobileOpen(true)
          }
        >
          <Menu size={22} />
        </button>

        <div className={styles.mobileBrand}>
          MineMods
        </div>
      </header>

      {/* OVERLAY */}
      <div
        className={`${styles.overlay} ${
          mobileOpen
            ? styles.overlayVisible
            : ""
        }`}
        onClick={closeMobile}
      />

      {/* SIDEBAR */}
      <aside
        className={`${styles.sidebar} ${
          mobileOpen
            ? styles.sidebarOpen
            : ""
        }`}
      >
        {/* MOBILE CLOSE */}
        <div className={styles.mobileSidebarTop}>
          <span>Menu</span>

          <button
            className={styles.closeButton}
            onClick={closeMobile}
          >
            <X size={20} />
          </button>
        </div>

        {/* PROFILE */}
        <button
          className={styles.profileCard}
          onClick={() =>
            navigate(
              `/users/${user.username}`
            )
          }
        >
          <img
            src={
              user.avatar ||
              "/default-avatar.png"
            }
            alt="avatar"
            className={styles.avatar}
          />

          <div className={styles.profileInfo}>
            <strong>
              {user.username ||
                "User"}
            </strong>

            <span>
              Creator Dashboard
            </span>
          </div>
        </button>

        {/* NAVIGATION */}
        <nav className={styles.navigation}>
          {navItems.map((item) => {
            const Icon =
              item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={
                  closeMobile
                }
                className={({
                  isActive,
                }) =>
                  `${styles.navButton} ${
                    isActive
                      ? styles.active
                      : ""
                  }`
                }
              >
                <div
                  className={
                    styles.navLeft
                  }
                >
                  <Icon size={18} />

                  <span>
                    {item.label}
                  </span>
                </div>
              </NavLink>
            );
          })}
        </nav>
      </aside>
    </>
  );
}