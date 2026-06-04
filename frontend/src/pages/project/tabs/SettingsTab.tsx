import { useState } from "react";

import {
  AlertTriangle,
  Globe,
  Lock,
  Trash2,
} from "lucide-react";

import Button from "@/shared/ui/button/Button";

import Input from "@/shared/ui/input/Input";

import Section from "@/shared/ui/section/Section";

import styles from "./SettingsTab.module.css";

export default function SettingsTab() {
  //////////////////////////////////////////////////
  // STATE
  //////////////////////////////////////////////////

  const [visibility, setVisibility] =
    useState("public");

  const [license, setLicense] =
    useState("MIT");

  const [discord, setDiscord] =
    useState("");

  const [github, setGithub] =
    useState("");

  const [website, setWebsite] =
    useState("");

  const [donation, setDonation] =
    useState("");

  //////////////////////////////////////////////////
  // ACTIONS
  //////////////////////////////////////////////////

  const handleSave = () => {
    console.log({
      visibility,
      license,
      discord,
      github,
      website,
      donation,
    });
  };

  const handleDelete = () => {
    const confirmed =
      confirm(
        "Delete this project permanently?"
      );

    if (!confirmed) return;

    console.log("delete");
  };

  //////////////////////////////////////////////////
  // RENDER
  //////////////////////////////////////////////////

  return (
    <div className={styles.page}>
      {/* VISIBILITY */}
      <Section
        title="Visibility"
        description="Control who can access and discover your project."
      >
        <div className={styles.visibilityGrid}>
          {/* PUBLIC */}
          <button
            className={`${styles.visibilityCard} ${
              visibility ===
              "public"
                ? styles.visibilityActive
                : ""
            }`}
            onClick={() =>
              setVisibility(
                "public"
              )
            }
          >
            <div
              className={
                styles.visibilityIcon
              }
            >
              <Globe size={22} />
            </div>

            <div>
              <h3>Public</h3>

              <p>
                Everyone can
                discover and
                download this
                project.
              </p>
            </div>
          </button>

          {/* PRIVATE */}
          <button
            className={`${styles.visibilityCard} ${
              visibility ===
              "private"
                ? styles.visibilityActive
                : ""
            }`}
            onClick={() =>
              setVisibility(
                "private"
              )
            }
          >
            <div
              className={
                styles.visibilityIcon
              }
            >
              <Lock size={22} />
            </div>

            <div>
              <h3>Private</h3>

              <p>
                Only collaborators
                can access this
                project.
              </p>
            </div>
          </button>
        </div>
      </Section>

      {/* LINKS */}
      <Section
        title="Links & Socials"
        description="Connect external platforms and community links."
      >
        <div className={styles.grid}>
          <Input
            label="Website"
            placeholder="https://example.com"
            value={website}
            onChange={(e) =>
              setWebsite(
                e.target.value
              )
            }
          />

          <Input
            label="GitHub"
            placeholder="https://github.com/..."
            value={github}
            onChange={(e) =>
              setGithub(
                e.target.value
              )
            }
          />

          <Input
            label="Discord"
            placeholder="https://discord.gg/..."
            value={discord}
            onChange={(e) =>
              setDiscord(
                e.target.value
              )
            }
          />

          <Input
            label="Donation Link"
            placeholder="https://ko-fi.com/..."
            value={donation}
            onChange={(e) =>
              setDonation(
                e.target.value
              )
            }
          />
        </div>
      </Section>

      {/* LICENSE */}
      <Section
        title="License"
        description="Choose how others can use your project."
      >
        <div className={styles.licenseBox}>
          <label>
            Project License
          </label>

          <select
            value={license}
            onChange={(e) =>
              setLicense(
                e.target.value
              )
            }
            className={styles.select}
          >
            <option value="MIT">
              MIT
            </option>

            <option value="GPL-3.0">
              GPL-3.0
            </option>

            <option value="Apache-2.0">
              Apache-2.0
            </option>

            <option value="ARR">
              All Rights Reserved
            </option>
          </select>
        </div>
      </Section>

      {/* SAVE */}
      <div className={styles.actions}>
        <Button onClick={handleSave}>
          Save Changes
        </Button>
      </div>

      {/* DANGER ZONE */}
      <Section
        title="Danger Zone"
        description="Permanent and destructive actions."
      >
        <div className={styles.dangerBox}>
          <div
            className={
              styles.dangerLeft
            }
          >
            <div
              className={
                styles.dangerIcon
              }
            >
              <AlertTriangle
                size={22}
              />
            </div>

            <div>
              <h3>
                Delete Project
              </h3>

              <p>
                This action cannot
                be undone.
              </p>
            </div>
          </div>

          <Button
            variant="ghost"
            onClick={
              handleDelete
            }
            className={
              styles.deleteButton
            }
          >
            <Trash2 size={16} />
            Delete
          </Button>
        </div>
      </Section>
    </div>
  );
}