import { useMemo, useState } from "react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import {
  Download,
  Eye,
  Heart,
  Plus,
  Search,
} from "lucide-react";

import { useAuth } from "@/features/auth/context/AuthContext";

import { useMods } from "@/features/mods/hooks";

import styles from "./ProjectsPage.module.css";

export default function ProjectsPage() {
  const navigate =
    useNavigate();

  const { user } =
    useAuth();

  //////////////////////////////////////////////////
  // SEARCH
  //////////////////////////////////////////////////

  const [search, setSearch] =
    useState("");

  //////////////////////////////////////////////////
  // GET PROJECTS
  //////////////////////////////////////////////////

  const {
    data,
    isLoading,
    error,
  } = useMods({
    authorId: user?.id,
  });

  //////////////////////////////////////////////////
  // FILTER PROJECTS
  //////////////////////////////////////////////////

  const filteredProjects =
    useMemo(() => {
      const mods =
        data?.data || [];

      return mods.filter(
        (mod: any) => {
          const text = `
            ${mod.title || ""}
            ${mod.description || ""}
            ${mod.summary || ""}
          `.toLowerCase();

          return text.includes(
            search.toLowerCase()
          );
        }
      );
    }, [data, search]);

  //////////////////////////////////////////////////
  // LOADING
  //////////////////////////////////////////////////

  if (isLoading) {
    return (
      <div className={styles.page}>
        <div
          className={
            styles.loading
          }
        >
          Loading projects...
        </div>
      </div>
    );
  }

  //////////////////////////////////////////////////
  // ERROR
  //////////////////////////////////////////////////

  if (error) {
    return (
      <div className={styles.page}>
        <div
          className={
            styles.error
          }
        >
          Failed to load projects
        </div>
      </div>
    );
  }

  //////////////////////////////////////////////////
  // EMPTY
  //////////////////////////////////////////////////

  const isEmpty =
    filteredProjects.length ===
    0;

  //////////////////////////////////////////////////
  // RENDER
  //////////////////////////////////////////////////

  return (
    <div className={styles.page}>
      {/* HEADER */}
      <div className={styles.topbar}>
        <div>
          <h1 className={styles.title}>
            Projects
          </h1>

          <p
            className={
              styles.subtitle
            }
          >
            Manage your mods,
            releases, gallery and
            settings.
          </p>
        </div>

        <button
          className={
            styles.createButton
          }
          onClick={() =>
            navigate("/create")
          }
        >
          <Plus size={18} />
          Create Project
        </button>
      </div>

      {/* SEARCH */}
      <div className={styles.searchBox}>
        <Search size={18} />

        <input
          type="text"
          placeholder="Search projects..."
          value={search}
          onChange={(e) =>
            setSearch(
              e.target.value
            )
          }
        />
      </div>

      {/* EMPTY STATE */}
      {isEmpty ? (
        <div
          className={
            styles.emptyState
          }
        >
          <h2>
            No projects found
          </h2>

          <p>
            Create your first
            Minecraft project.
          </p>

          <button
            className={
              styles.emptyButton
            }
            onClick={() =>
              navigate("/create")
            }
          >
            <Plus size={18} />
            Create Project
          </button>
        </div>
      ) : (
        <div className={styles.grid}>
          {filteredProjects.map(
            (mod: any) => {
              //////////////////////////////////////////////////
              // ICON
              //////////////////////////////////////////////////

              const icon =
                mod.icon
                  ? `${import.meta.env.VITE_API_URL}${mod.icon}`
                  : "/default-mod.png";

              //////////////////////////////////////////////////
              // TAGS
              //////////////////////////////////////////////////

              const tags = [
                mod.platform,
                mod.loader,
                ...(mod.tags?.map(
                  (tag: any) =>
                    tag.name ||
                    tag.tag?.name
                ) || []),
              ]
                .filter(Boolean)
                .slice(0, 5);

              //////////////////////////////////////////////////
              // CARD
              //////////////////////////////////////////////////

              return (
                <Link
                  key={mod.id}
                  to={`/project/${mod.slug}`}
                  className={
                    styles.card
                  }
                >
                  {/* TOP */}
                  <div
                    className={
                      styles.cardTop
                    }
                  >
                    <img
                      src={icon}
                      alt={mod.title}
                      className={
                        styles.icon
                      }
                    />

                    <div
                      className={
                        styles.info
                      }
                    >
                      <h2>
                        {mod.title}
                      </h2>

                      <p>
                        {mod.summary ||
                          mod.description}
                      </p>
                    </div>
                  </div>

                  {/* TAGS */}
                  <div
                    className={
                      styles.tags
                    }
                  >
                    {tags.map(
                      (
                        tag: string
                      ) => (
                        <span
                          key={tag}
                          className={
                            styles.tag
                          }
                        >
                          {tag}
                        </span>
                      )
                    )}
                  </div>

                  {/* FOOTER */}
                  <div
                    className={
                      styles.footer
                    }
                  >
                    <div
                      className={
                        styles.stats
                      }
                    >
                      <div
                        className={
                          styles.stat
                        }
                      >
                        <Download
                          size={15}
                        />

                        <span>
                          {(
                            mod.downloads ||
                            0
                          ).toLocaleString()}
                        </span>
                      </div>

                      <div
                        className={
                          styles.stat
                        }
                      >
                        <Heart
                          size={15}
                        />

                        <span>
                          {(
                            mod.likesCount ||
                            0
                          ).toLocaleString()}
                        </span>
                      </div>

                      <div
                        className={
                          styles.stat
                        }
                      >
                        <Eye
                          size={15}
                        />

                        <span>
                          {(
                            mod.views ||
                            0
                          ).toLocaleString()}
                        </span>
                      </div>
                    </div>

                    <div
                      className={
                        styles.meta
                      }
                    >
                      <span
                        className={
                          styles.visibility
                        }
                      >
                        {
                          mod.visibility
                        }
                      </span>

                      <span
                        className={
                          styles.status
                        }
                      >
                        {mod.status}
                      </span>
                    </div>
                  </div>
                </Link>
              );
            }
          )}
        </div>
      )}
    </div>
  );
}