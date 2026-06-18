import {
  NavLink,
  Outlet,
  useParams,
} from "react-router-dom";

import {
  Globe,
  Lock,
  Package,
  Star,
} from "lucide-react";

import { useMod } from "@/features/mods/hooks";

import { useAuth } from "@/features/auth/context/AuthContext";

import Skeleton from "@/shared/ui/Skeleton";

import styles from "./ProjectDashboard.module.css";

export default function ProjectDashboard() {
  const { slug } = useParams();

  const {
    data,
    isLoading,
  } = useMod(slug!);

  const { user } =
    useAuth();

  //////////////////////////////////////////////////
  // LOADING
  //////////////////////////////////////////////////

  if (isLoading) {
    return (
      <div className={styles.loading}>
        <Skeleton height={260} />
      </div>
    );
  }

  //////////////////////////////////////////////////
  // NOT FOUND
  //////////////////////////////////////////////////

  if (!data) {
    return (
      <div className={styles.notFound}>
        <h2>
          Project not found
        </h2>

        <p>
          This project does not
          exist or was removed.
        </p>
      </div>
    );
  }

  //////////////////////////////////////////////////
  // OWNER
  //////////////////////////////////////////////////

  const isOwner =
    user?.id ===
    data.authorId;

  //////////////////////////////////////////////////
  // TABS
  //////////////////////////////////////////////////

  const tabs = [
    {
      label: "Overview",
      to: `/project/${slug}`,
      end: true,
    },

    {
      label: "Versions",
      to: `/project/${slug}/versions`,
    },

    {
      label: "Gallery",
      to: `/project/${slug}/gallery`,
    },

    {
      label: "Settings",
      to: `/project/${slug}/settings`,
    },
  ];

  //////////////////////////////////////////////////
  // DATA
  //////////////////////////////////////////////////

  const downloads =
    data.downloadCount || 0;

  const followers =
    data.favoriteCount || 0;

  const visibility =
    data.visibility ||
    "Public";

  //////////////////////////////////////////////////
  // RENDER
  //////////////////////////////////////////////////

  return (
    <div className={styles.page}>
      {/* HEADER */}
      <section className={styles.header}>
        {/* TOP */}
        <div className={styles.topSection}>
          {/* ICON */}
          <div className={styles.iconWrapper}>
            <img
              src={
                data.iconUrl ||
                "/default-mod.png"
              }
              alt={data.title}
              className={styles.icon}
            />
          </div>

          {/* INFO */}
          <div className={styles.info}>
            <div className={styles.titleRow}>
              <h1 className={styles.title}>
                {data.title}
              </h1>

              <div
                className={
                  styles.visibility
                }
              >
                {visibility ===
                "Public" ? (
                  <>
                    <Globe size={14} />
                    Public
                  </>
                ) : (
                  <>
                    <Lock size={14} />
                    Private
                  </>
                )}
              </div>
            </div>

            <p
              className={
                styles.description
              }
            >
              {data.summary}
            </p>

            {/* STATS */}
            <div className={styles.stats}>
              <div
                className={
                  styles.statCard
                }
              >
                <Package size={16} />

                <span>
                  {downloads.toLocaleString()}{" "}
                  downloads
                </span>
              </div>

              <div
                className={
                  styles.statCard
                }
              >
                <Star size={16} />

                <span>
                  {followers.toLocaleString()}{" "}
                  followers
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* TABS */}
        <div className={styles.tabs}>
          {tabs.map((tab) => (
            <NavLink
              key={tab.to}
              to={tab.to}
              end={tab.end}
              className={({
                isActive,
              }) =>
                `${styles.tab} ${
                  isActive
                    ? styles.activeTab
                    : ""
                }`
              }
            >
              {tab.label}
            </NavLink>
          ))}
        </div>
      </section>

      {/* CONTENT */}
      <section
        className={styles.content}
      >
        <Outlet
          context={{
            mod: data,
            isOwner,
          }}
        />
      </section>
    </div>
  );
}