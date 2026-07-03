import { useState }
  from "react";

import {
  useMySocials,
} from "../../hooks/useMySocials";

import {
  useSaveSocial,
} from "../../hooks/useSaveSocial";

import {
  useDeleteSocial,
} from "../../hooks/useDeleteSocial";

interface Props {
  token: string;
}

const platforms = [
    "GITHUB",
    "DISCORD",
    "YOUTUBE",
    "INSTAGRAM",
    "PATREON",
    "KOFI",
    "TWITCH",
    "X",
    "TIKTOK",
    "WEBSITE",
];

export default function SocialsManager({
  token,
}: Props) {
  const {
    data = [],
  } = useMySocials(
    token
  );

  const saveSocial =
    useSaveSocial(token);

  const deleteSocial =
    useDeleteSocial(token);

  const [urls, setUrls] =
    useState<
      Record<string, string>
    >({});

  function getValue(
    platform: string
  ) {
    return (
      urls[platform] ??
      data.find(
        (s: any) =>
          s.platform ===
          platform
      )?.url ??
      ""
    );
  }

  async function handleSave(
    platform: string
  ) {
    const url =
      getValue(platform);

    if (!url.trim()) {
      return;
    }

    await saveSocial.mutateAsync({
      platform,
      url,
    });
  }

  async function handleDelete(
    platform: string
  ) {
    await deleteSocial.mutateAsync(
      platform
    );
  }

  return (
    <div>
      <h2>
        Redes Sociale
      </h2>

      {platforms.map(
        (platform) => (
          <div key={platform}>
            <label>
              {platform}
            </label>

            <input
              value={getValue(
                platform
              )}
              onChange={(e) =>
                setUrls(
                  (
                    prev
                  ) => ({
                    ...prev,

                    [platform]:
                      e.target
                        .value,
                  })
                )
              }
            />

            <button
              onClick={() =>
                handleSave(
                  platform
                )
              }
            >
              Guardar
            </button>

            <button
              onClick={() =>
                handleDelete(
                  platform
                )
              }
            >
              Eliminar
            </button>
          </div>
        )
      )}
    </div>
  );
}