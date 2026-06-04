import { useMemo, useState } from "react";
import {
  PLATFORM_OPTIONS,
  LOADER_OPTIONS,
  PROJECT_TYPE_OPTIONS,
} from "@/entities/mod/enums";

import {
  JAVA_CATEGORIES,
  BEDROCK_CATEGORIES,
} from "@/entities/mod/categories";

import {
  ImagePlus,
} from "lucide-react";

import Section from "@/shared/ui/section/Section";
import Input from "@/shared/ui/input/Input";
import Textarea from "@/shared/ui/textarea/Textarea";
import Button from "@/shared/ui/button/Button";

import styles from "./StepBasicInfo.module.css";

type Props = {
  data: any;
  setData: (data: any) => void;
  next: () => void;
};

export default function StepBasicInfo({ data, setData, next }: Props) {
  const [tagInput, setTagInput] = useState("");

  const addTag = () => {
    if (tagInput && !data.tags.includes(tagInput)) {
      setData({ ...data, tags: [...data.tags, tagInput] });
      setTagInput("");
    }
  };

  const removeTag = (tag: string) => {
    setData({
      ...data,
      tags: data.tags.filter(
        (t: string) => t !== tag
      ),
    });
  };

  const [coverPreview, setCoverPreview] = useState<string | null>(null);

  const currentCategories = useMemo(() => {
    if (!data.type) return [];

    if (data.platform === "JAVA") {
      return (
        JAVA_CATEGORIES[
          data.type as keyof typeof JAVA_CATEGORIES
        ] || []
      );
    }

    if (data.platform === "BEDROCK") {
      return (
        BEDROCK_CATEGORIES[
          data.type as keyof typeof BEDROCK_CATEGORIES
        ] || []
      );
    }

    return [];
  }, [data.platform, data.type]);

  const javaTypes = PROJECT_TYPE_OPTIONS.filter((t) =>
    [
      "PLUGIN",
      "MOD",
      "MODPACK",
      "SHADER",
      "DATA_PACK",
      "RESOURCE_PACK",
      "WORLD",
    ].includes(t.value)
  );

  const bedrockTypes = PROJECT_TYPE_OPTIONS.filter((t) =>
    [
      "ADDON",
      "TEXTURE",
      "SCRIPT",
    ].includes(t.value)
  );

  return (
    <Section
      title="Basic Information"
      description="Main information about your project."
    >
      <div className={styles.layout}>
        {/* LEFT */}
        <div className={styles.leftCard}>
          <div className={styles.hero}>
            <label className={styles.uploadBox}>
              <Input
                type="file"
                hidden
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];

                  if (!file) return;

                  setData({
                    ...data,
                    icon: file,
                  });

                  setCoverPreview(
                    URL.createObjectURL(file)
                  );
                }}
              />

              {coverPreview ? (
                <img
                  src={coverPreview}
                  className={styles.preview}
                />
              ) : (
                <>
                  <ImagePlus size={40} />
                  <span>Upload Icon</span>
                </>
              )}
            </label>

            <div className={styles.heroContent}>
              <Input
                placeholder="Project Name"
                value={data.title}
                onChange={(e) =>
                  setData({
                    ...data,
                    title: e.target.value,
                  })
                }
              />

              <Textarea
                placeholder="Short project summary..."
                value={data.summary}
                onChange={(e) =>
                  setData({
                    ...data,
                    summary: e.target.value,
                  })
                }
              />
            </div>
          </div>

          <Textarea
            placeholder="Description"
            value={data.description}
            onChange={(e) =>
              setData({
                ...data,
                description: e.target.value,
              })
            }
          />
        </div>

        {/* RIGHT */}
        <div className={styles.rightColumn}>
          <div className={styles.configCard}>
            <h3>Project Settings</h3>

            {/* PLATFORM */}
            <select
              value={data.platform}
              onChange={(e) =>
                setData({
                  ...data,
                  platform: e.target.value,
                  loader: "",
                  type: "",
                  categories: [],
                })
              }
            >
              <option value="">
                Select Platform
              </option>

              {PLATFORM_OPTIONS.map((platform) => (
                <option
                  key={platform.value}
                  value={platform.value}
                >
                  {platform.label}
                </option>
              ))}
            </select>

            {/* LOADER */}
            {data.platform === "JAVA" && (
              <select
                value={data.loader}
                onChange={(e) =>
                  setData({
                    ...data,
                    loader: e.target.value,
                  })
                }
              >
                <option value="">
                  Select Loader
                </option>

                {LOADER_OPTIONS.map((loader) => (
                  <option
                    key={loader.value}
                    value={loader.value}
                  >
                    {loader.label}
                  </option>
                ))}
              </select>
            )}

            {/* TYPE JAVA */}
            {data.platform === "JAVA" && (
              <select
                value={data.type}
                onChange={(e) =>
                  setData({
                    ...data,
                    type: e.target.value,
                    categories: [],
                  })
                }
              >
                <option value="">
                  Select Type
                </option>

                {javaTypes.map((type) => (
                  <option
                    key={type.value}
                    value={type.value}
                  >
                    {type.label}
                  </option>
                ))}
              </select>
            )}

            {/* TYPE BEDROCK */}
            {data.platform === "BEDROCK" && (
              <select
                value={data.type}
                onChange={(e) =>
                  setData({
                    ...data,
                    type: e.target.value,
                    categories: [],
                  })
                }
              >
                <option value="">
                  Select Type
                </option>

                {bedrockTypes.map((type) => (
                  <option
                    key={type.value}
                    value={type.value}
                  >
                    {type.label}
                  </option>
                ))}
              </select>
            )}

            {/* CATEGORY */}
            {currentCategories.length > 0 && (
              <select
                value={data.categories[0] || ""}
                onChange={(e) =>
                  setData({
                    ...data,
                    categories: [e.target.value],
                  })
                }
              >
                <option value="">
                  Select Category
                </option>

                {currentCategories.map((category) => (
                  <option
                    key={category}
                    value={category}
                  >
                    {category}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* TAGS */}
          <div className={styles.tagsCard}>
            <h3>Tags</h3>

            <div className={styles.tagInputRow}>
              <Input
                value={tagInput}
                onChange={(e) =>
                  setTagInput(e.target.value)
                }
                placeholder="Tag..."
              />

              <Button
                type="button"
                onClick={addTag}
              >
                +
              </Button>
            </div>

            <div className={styles.tags}>
              {data.tags.map((tag: string) => (
                <div
                  key={tag}
                  className={styles.tag}
                >
                  <span>{tag}</span>

                  <button
                    type="button"
                    onClick={() =>
                      removeTag(tag)
                    }
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <Button
        className={styles.nextButton}
        onClick={next}
      >
        Continue →
      </Button>
    </Section>
  );
}