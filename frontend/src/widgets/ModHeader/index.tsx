import { useNavigate } from "react-router-dom";

import { useAuth } from "@/context/AuthContext";

import LikeButton from "@/features/interactions/components/LikeButton";
import FavoriteButton from "@/features/interactions/components/FavoriteButton";

type ModHeaderProps = {
  mod: any;
};

export default function ModHeader({
  mod,
}: ModHeaderProps) {
  ////////////////////////////////////////////////////
  // COVER
  ////////////////////////////////////////////////////

  const cover =
    mod.images?.find(
      (i: any) => i.isCover
    );

  ////////////////////////////////////////////////////
  // AUTH
  ////////////////////////////////////////////////////

  const { user } =
    useAuth();

  const navigate =
    useNavigate();

  const isOwner =
    user?.id === mod.author?.id;

  ////////////////////////////////////////////////////
  // UI
  ////////////////////////////////////////////////////

  return (
    <div
      style={{
        display: "flex",
        gap: 20,
      }}
    >
      {/* COVER */}

      <img
        src={`${
          import.meta.env
            .VITE_API_URL
        }${cover?.url}`}
        alt={mod.title}
        style={{
          width: 140,
          height: 140,

          borderRadius: 16,

          objectFit: "cover",
        }}
      />

      {/* CONTENT */}

      <div
        style={{
          flex: 1,
        }}
      >
        {/* TITLE */}

        <h1
          style={{
            margin: 0,
            fontSize: 34,
          }}
        >
          {mod.title}
        </h1>

        {/* META */}

        <div
          style={{
            display: "flex",
            gap: 14,

            marginTop: 10,

            opacity: 0.7,
          }}
        >
          <span>
            👁{" "}
            {mod.stats.views}
          </span>

          <span>
            ⬇️{" "}
            {
              mod.stats
                .downloads
            }
          </span>

          <span>
            👤{" "}
            {
              mod.author
                ?.username
            }
          </span>
        </div>

        {/* DESCRIPTION */}

        <p
          style={{
            opacity: 0.8,

            marginTop: 16,

            lineHeight: 1.5,
          }}
        >
          {mod.description}
        </p>

        {/* TAGS */}

        <div
          style={{
            display: "flex",

            gap: 8,

            flexWrap:
              "wrap",
          }}
        >
          {mod.tags?.map(
            (tag: any) => (
              <span
                key={tag.id}
                style={{
                  background:
                    "#2a2a2a",

                  padding:
                    "6px 10px",

                  borderRadius: 999,

                  fontSize: 13,
                }}
              >
                {tag.name}
              </span>
            )
          )}
        </div>

        {/* ACTIONS */}

        <div
          style={{
            marginTop: 18,

            display: "flex",

            gap: 12,
          }}
        >
          {/* LIKE */}

          <LikeButton
            modId={mod.id}
            slug={mod.slug}
            liked={
              mod
                .interactions
                .liked
            }
            likes={
              mod.stats.likes
            }
          />

          {/* FAVORITE */}

          <FavoriteButton
            modId={mod.id}
            slug={mod.slug}
            favorited={
              mod
                .interactions
                .favorited
            }
            favorites={
              mod.stats
                .favorites
            }
          />

          {/* DOWNLOAD */}

          <button>
            ⬇️ Descargar
          </button>

          {/* OWNER */}

          {isOwner && (
            <button
              onClick={() =>
                navigate(
                  `/project/${mod.slug}`
                )
              }
            >
              ✏️ Dashboard
            </button>
          )}
        </div>
      </div>
    </div>
  );
}