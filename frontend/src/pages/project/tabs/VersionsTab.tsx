import { useEffect, useState, } from "react";

import { useOutletContext } from "react-router-dom";

import {
  FileArchive,
  Plus,
  Upload,
} from "lucide-react";

import Button from "@/shared/ui/button/Button";
import Input from "@/shared/ui/input/Input";
import Section from "@/shared/ui/section/Section";
import Textarea from "@/shared/ui/textarea/Textarea";

import FileDropzone from "@/pages/project/components/FileDropzone";

import VersionsTable from "@/widgets/VersionsTable";

import styles from "./VersionsTab.module.css";

//////////////////////////////////////////////////
// MC VERSIONS
//////////////////////////////////////////////////

const MC_VERSIONS_JAVA = [
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
];

const MC_VERSIONS_BEDROCK = [
  "1.21.0",
  "1.20.80",
  "1.20.70",
  "1.20.60",
  "1.20.50",
  "1.20.40",
  "1.20.30",
  "1.20.10",
  "1.20.0",
];

//////////////////////////////////////////////////
// TYPES
//////////////////////////////////////////////////

type ModFile = {
  id: number;

  filename?: string;

  size: number;

  releaseType: string;

  downloads: number;

  url?: string;
};

type Version = {
  id: number;

  version: string;

  minecraftVersion: string;

  loader?: string;

  createdAt: string;

  changelog?: string;

  releaseType?: string;

  downloads?: number;

  files?: ModFile[];
};

//////////////////////////////////////////////////
// COMPONENT
//////////////////////////////////////////////////

export default function VersionsTab() {
  const { mod } =
    useOutletContext<any>();

  //////////////////////////////////////////////////
  // STATE
  //////////////////////////////////////////////////

  const [versions, setVersions] =
    useState<Version[]>([]);

  const [versionId, setVersionId] =
    useState<number | null>(
      null
    );

  const [loading, setLoading] =
    useState(false);

  //////////////////////////////////////////////////
  // FORM
  //////////////////////////////////////////////////

  const [versionName, setVersionName] =
    useState("");

  const [gameVersion, setGameVersion] =
    useState("");

  const [loader, setLoader] =
    useState("");

  const [changelog, setChangelog] =
    useState("");

  const [releaseType, setReleaseType] =
    useState("release");

  //////////////////////////////////////////////////
  // MC VERSIONS
  //////////////////////////////////////////////////

  const versionsList =
    mod.platform === "BEDROCK"
      ? MC_VERSIONS_BEDROCK
      : MC_VERSIONS_JAVA;

  //////////////////////////////////////////////////
  // SYNC VERSIONS
  //////////////////////////////////////////////////

  useEffect(() => {
    if (mod?.versions) {
      setVersions(mod.versions);
    }
  }, [mod]);

  //////////////////////////////////////////////////
  // CREATE VERSION
  //////////////////////////////////////////////////

  const handlePublish = async () => {
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
            version:
              versionName,

            minecraftVersion:
              gameVersion,

            loader:
              mod.platform ===
              "JAVA"
                ? loader
                : undefined,

            changelog,

            releaseType,
          }),
        }
      );

      if (!res.ok) {
        throw new Error(
          "Error creando versión"
        );
      }

      const data =
        await res.json();

      //////////////////////////////////////////////////
      // UPDATE STATE
      //////////////////////////////////////////////////

      setVersions((prev) => [
        data,
        ...prev,
      ]);

      setVersionId(data.id);

      //////////////////////////////////////////////////
      // RESET
      //////////////////////////////////////////////////

      setVersionName("");

      setGameVersion("");

      setLoader("");

      setChangelog("");

      setReleaseType(
        "release"
      );

    } catch (err) {
      console.error(err);

      alert(
        "Error creando versión"
      );
    } finally {
      setLoading(false);
    }
  };

  //////////////////////////////////////////////////
  // RENDER
  //////////////////////////////////////////////////

  return (
    <div className={styles.page}>
      {/* CREATE */}
      <Section
        title="Create Version"
        description="Upload and publish a new release for your project."
      >
        <div className={styles.form}>
          {/* GRID */}
          <div className={styles.grid}>
            {/* VERSION */}
            <Input
              label="Version Name"
              placeholder="Name"
              value={versionName}
              onChange={(e) =>
                setVersionName(
                  e.target.value
                )
              }
            />

            {/* MC VERSION */}
            <div
              className={
                styles.field
              }
            >
              <label>
                Minecraft Version
              </label>

              <select
                value={gameVersion}
                onChange={(e) =>
                  setGameVersion(
                    e.target.value
                  )
                }
                className={
                  styles.select
                }
              >
                <option value="">
                  Select version
                </option>

                {versionsList.map(
                  (version) => (
                    <option
                      key={version}
                      value={version}
                    >
                      {version}
                    </option>
                  )
                )}
              </select>
            </div>

            {/* LOADER */}
            {mod.platform ===
              "JAVA" && (
              <div
                className={
                  styles.field
                }
              >
                <label>
                  Loader
                </label>

                <select
                  value={loader}
                  onChange={(e) =>
                    setLoader(
                      e.target.value
                    )
                  }
                  className={
                    styles.select
                  }
                >
                  <option value="">
                    Select loader
                  </option>

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
              </div>
            )}

            {/* TYPE */}
            <div
              className={
                styles.field
              }
            >
              <label>
                Release Type
              </label>

              <select
                value={releaseType}
                onChange={(e) =>
                  setReleaseType(
                    e.target.value
                  )
                }
                className={
                  styles.select
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
            </div>
          </div>

          {/* CHANGELOG */}
          <Textarea
            label="Changelog"
            placeholder="Describe what changed in this version..."
            value={changelog}
            onChange={(e) =>
              setChangelog(
                e.target.value
              )
            }
          />

          {/* ACTIONS */}
          <div
            className={
              styles.actions
            }
          >
            <Button
              onClick={
                handlePublish
              }
              disabled={loading}
            >
              <Plus size={16} />

              {loading
                ? "Publishing..."
                : "Publish Version"}
            </Button>
          </div>
        </div>
      </Section>

      {/* FILE UPLOAD */}
      {versionId && (
        <Section
          title="Upload Files"
          description="Attach files to the latest version."
        >
          <FileDropzone
            versionId={versionId}
          />
        </Section>
      )}

      {/* RELEASES */}
      <Section>

        {/* TABLE */}
        <div
          className={
            styles.tableWrapper
          }
        >
          <VersionsTable
            modId={mod.id}
            versions={versions}
            isOwner
          />
        </div>
      </Section>
    </div>
  );
}