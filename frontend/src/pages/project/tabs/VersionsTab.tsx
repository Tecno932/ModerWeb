import { useState } from "react";
import { useOutletContext } from "react-router-dom";

import FileDropzone from "@/pages/project/components/FileDropzone";
import VersionsTable from "@/widgets/VersionsTable/index";

const MC_VERSIONS_JAVA: string[] = [
  "1.21.1",
  "1.21",
  "1.20.6",
  "1.20.5",
  "1.20.4",
  "1.20.3",
  "1.20.2",
  "1.20.1",
  "1.20",
  "1.19.4",
  "1.19.3",
  "1.19.2",
  "1.19.1",
  "1.19",
  "1.18.2",
  "1.18.1",
  "1.18",
];

const MC_VERSIONS_BEDROCK: string[] = [
  "1.21.0",
  "1.20.80",
  "1.20.70",
  "1.20.60",
  "1.20.50",
  "1.20.40",
  "1.20.30",
  "1.20.10",
  "1.20.0",
  "1.19.80",
  "1.19.70",
  "1.19.60",
  "1.19.50",
  "1.19.40",
  "1.19.30",
  "1.19.20",
  "1.19.10",
  "1.19.0",
  "1.18.30",
  "1.18.20",
  "1.18.10",
  "1.18.0",
];

type ModFile = {
  id: string;
  filename?: string;
  size: number;
  releaseType: string;
  downloads: number;
  url?: string;
};

type Version = {
  id: string;
  version: string;
  minecraftVersion: string;
  loader?: string;
  createdAt: string;
  files?: ModFile[];
};

export default function VersionsTab() {
  const { mod } = useOutletContext<any>();

  const [versions, setVersions] = useState<Version[]>(
    mod.versions || []
  );

  const [versionId, setVersionId] =
    useState<number | null>(null);

  const [releaseType, setReleaseType] =
    useState("release");

  const [loading, setLoading] =
    useState(false);

  const versionsList =
    mod.platform === "BEDROCK"
      ? MC_VERSIONS_BEDROCK
      : MC_VERSIONS_JAVA;

  //////////////////////////////////////////////////////
  // CREATE VERSION
  //////////////////////////////////////////////////////

  const handleCreateVersion = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    const form = e.currentTarget;

    const version = (
      form.elements.namedItem(
        "version"
      ) as HTMLInputElement
    ).value;

    const minecraftVersion = (
      form.elements.namedItem(
        "minecraftVersion"
      ) as HTMLSelectElement
    ).value;

    const loader =
      mod.platform === "JAVA"
        ? (
            form.elements.namedItem(
              "loader"
            ) as HTMLSelectElement
          ).value
        : undefined;

    try {
      setLoading(true);

      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/mods/${mod.id}/versions`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",

            Authorization: `Bearer ${localStorage.getItem(
              "token"
            )}`,
          },

          body: JSON.stringify({
            version,
            minecraftVersion,
            loader,
            releaseType,
          }),
        }
      );

      if (!res.ok) {
        throw new Error(
          "Error creando versión"
        );
      }

      const data = await res.json();

      setVersionId(Number(data.id));

      setVersions((prev) => [
        data,
        ...prev,
      ]);

      form.reset();

    } catch (err) {
      console.error(err);

      alert("Error creando versión");
    } finally {
      setLoading(false);
    }
  };

  //////////////////////////////////////////////////////
  // UI
  //////////////////////////////////////////////////////

  return (
    <div>
      <h2>📦 Versions</h2>

      <form onSubmit={handleCreateVersion}>
        <input
          name="version"
          placeholder="Version name"
          required
        />

        <select
          name="minecraftVersion"
          required
        >
          {versionsList.map((v) => (
            <option
              key={v}
              value={v}
            >
              {v}
            </option>
          ))}
        </select>

        {mod.platform === "JAVA" && (
          <select name="loader">
            <option value="FABRIC">
              Fabric
            </option>

            <option value="FORGE">
              Forge
            </option>

            <option value="NEOFORGE">
              NeoForge
            </option>

            <option value="QUILT">
              Quilt
            </option>
          </select>
        )}

        <select
          value={releaseType}
          onChange={(e) =>
            setReleaseType(
              e.target.value
            )
          }
        >
          <option value="release">
            Release
          </option>

          <option value="beta">
            Beta
          </option>

          <option value="alpha">
            Alpha
          </option>
        </select>

        <button disabled={loading}>
          {loading
            ? "Creating..."
            : "Create version"}
        </button>
      </form>

      {versionId && (
        <div style={{ marginTop: 24 }}>
          <h3>Upload files</h3>

          <FileDropzone
            versionId={versionId}
          />
        </div>
      )}

      <VersionsTable
        versions={versions}
        isOwner
      />
    </div>
  );
}