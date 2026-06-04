import { useMemo, useState } from "react";

import {
  ImagePlus,
  Plus,
  Save,
  X,
} from "lucide-react";

import Button from "@/shared/ui/button/Button";

import Input from "@/shared/ui/input/Input";

import Section from "@/shared/ui/section/Section";

import Textarea from "@/shared/ui/textarea/Textarea";

import styles from "./OverviewTab.module.css";

export default function OverviewTab() {
  //////////////////////////////////////////////////
  // MOCK DATA
  //////////////////////////////////////////////////

  // luego conectar con backend
  const [title, setTitle] =
    useState("Epic Weapons");

  const [summary, setSummary] =
    useState(
      "Adds dozens of fantasy weapons with unique abilities."
    );

  const [
    description,
    setDescription,
  ] = useState(
    `# Epic Weapons

A massive content expansion mod focused on high-quality combat mechanics, legendary weapons and RPG progression.`
  );

  //////////////////////////////////////////////////
  // TAGS
  //////////////////////////////////////////////////

  const [tagInput, setTagInput] =
    useState("");

  const [tags, setTags] =
    useState([
      "Forge",
      "1.20.1",
      "RPG",
      "Adventure",
    ]);

  const addTag = () => {
    const value =
      tagInput.trim();

    if (!value) return;

    if (tags.includes(value)) {
      return;
    }

    setTags((prev) => [
      ...prev,
      value,
    ]);

    setTagInput("");
  };

  const removeTag = (
    tag: string
  ) => {
    setTags((prev) =>
      prev.filter(
        (item) => item !== tag
      )
    );
  };

  //////////////////////////////////////////////////
  // SAVE
  //////////////////////////////////////////////////

  const hasChanges = useMemo(() => {
    return true;
  }, [
    title,
    summary,
    description,
    tags,
  ]);

  const handleSave = () => {
    console.log({
      title,
      summary,
      description,
      tags,
    });
  };

  //////////////////////////////////////////////////
  // RENDER
  //////////////////////////////////////////////////

  return (
    <div className={styles.page}>
      {/* GENERAL */}
      <Section
        title="General Information"
        description="Customize your project information, branding and public details."
      >
        <div className={styles.layout}>
          {/* LEFT */}
          <div className={styles.main}>
            {/* ICON */}
            <div
              className={
                styles.fieldGroup
              }
            >
              <label
                className={
                  styles.label
                }
              >
                Project Icon
              </label>

              <div
                className={
                  styles.uploadBox
                }
              >
                <div
                  className={
                    styles.iconPreview
                  }
                >
                  <img
                    src="/default-mod.png"
                    alt="icon"
                  />
                </div>

                <div
                  className={
                    styles.uploadInfo
                  }
                >
                  <h3>
                    Upload Icon
                  </h3>

                  <p>
                    PNG, JPG or WEBP.
                    Recommended size:
                    512x512.
                  </p>

                  <Button variant="secondary">
                    <ImagePlus
                      size={16}
                    />
                    Choose File
                  </Button>
                </div>
              </div>
            </div>

            {/* TITLE */}
            <Input
              label="Project Title"
              placeholder="Enter project title..."
              value={title}
              onChange={(e) =>
                setTitle(
                  e.target.value
                )
              }
            />

            {/* SUMMARY */}
            <Textarea
              label="Short Summary"
              placeholder="Write a short summary..."
              value={summary}
              onChange={(e) =>
                setSummary(
                  e.target.value
                )
              }
              className={
                styles.summaryInput
              }
            />

            {/* DESCRIPTION */}
            <Textarea
              label="Description"
              placeholder="Write a detailed project description..."
              value={description}
              onChange={(e) =>
                setDescription(
                  e.target.value
                )
              }
            />
          </div>

          {/* RIGHT */}
          <div className={styles.sidebar}>
            {/* TAGS */}
            <Section
              title="Tags"
              description="Add keywords and categories."
            >
              <div
                className={
                  styles.tagInputRow
                }
              >
                <input
                  type="text"
                  placeholder="Add tag..."
                  value={tagInput}
                  onChange={(e) =>
                    setTagInput(
                      e.target.value
                    )
                  }
                  className={
                    styles.tagInput
                  }
                />

                <button
                  className={
                    styles.addButton
                  }
                  onClick={addTag}
                >
                  <Plus size={16} />
                </button>
              </div>

              <div
                className={
                  styles.tags
                }
              >
                {tags.map((tag) => (
                  <div
                    key={tag}
                    className={
                      styles.tag
                    }
                  >
                    <span>
                      {tag}
                    </span>

                    <button
                      onClick={() =>
                        removeTag(
                          tag
                        )
                      }
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </Section>

            {/* HELP */}
            <Section
              title="Tips"
              description="Improve your project visibility."
            >
              <ul
                className={
                  styles.tipList
                }
              >
                <li>
                  Use a unique and
                  recognizable icon.
                </li>

                <li>
                  Keep your summary
                  concise and clear.
                </li>

                <li>
                  Add relevant tags
                  to improve search
                  discoverability.
                </li>

                <li>
                  Use markdown in
                  your description.
                </li>
              </ul>
            </Section>
          </div>
        </div>
      </Section>

      {/* SAVE BAR */}
      <div
        className={`${styles.saveBar} ${
          hasChanges
            ? styles.saveBarVisible
            : ""
        }`}
      >
        <div>
          <strong>
            Unsaved changes
          </strong>

          <p>
            Save your project
            updates.
          </p>
        </div>

        <Button onClick={handleSave}>
          <Save size={16} />
          Save Changes
        </Button>
      </div>
    </div>
  );
}