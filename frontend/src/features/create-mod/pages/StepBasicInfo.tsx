import { useState } from "react";
import {
  PLATFORM_OPTIONS,
  LOADER_OPTIONS,
  PROJECT_TYPE_OPTIONS,
  CATEGORIES,
} from "@/entities/mod/enums";

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

  const [coverPreview, setCoverPreview] = useState<string | null>(null);

  const toggleCategory = (value: string) => {
    const exists = data.categories.includes(value);

    if (exists) {
      setData({
        ...data,
        categories: data.categories.filter((c: string) => c !== value),
      });
    } else {
      setData({
        ...data,
        categories: [...data.categories, value],
      });
    }
  };

  return (
    <div>
      <h2>Basic Info</h2>

      <input
        placeholder="Project name"
        value={data.title}
        onChange={(e) => setData({ ...data, title: e.target.value })}
      />

      <textarea
        placeholder="Summary"

        value={data.summary}

        onChange={(e) =>
          setData({
            ...data,
            summary: e.target.value,
          })
        }
      />

      <textarea
        placeholder="Description"

        value={data.description}

        onChange={(e) =>
          setData({
            ...data,
            description: e.target.value,
          })
        }
      />

      <input
        type="text"

        placeholder="License (MIT, GPL-3.0...)"

        value={data.license}

        onChange={(e) =>
          setData({
            ...data,
            license: e.target.value,
          })
        }
      />

      <select
        value={data.visibility}

        onChange={(e) =>
          setData({
            ...data,
            visibility: e.target.value,
          })
        }
      >
        <option value="PUBLIC">
          Public
        </option>

        <option value="UNLISTED">
          Unlisted
        </option>

        <option value="PRIVATE">
          Private
        </option>
      </select>

      {/* ICON */}
      <input
        type="file"
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

      {coverPreview && <img src={coverPreview} width={150} />}

      {/* TYPE */}
      <select
        value={data.type}
        onChange={(e) => setData({ ...data, type: e.target.value })}
      >
        <option value="">Tipo</option>
        {PROJECT_TYPE_OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>

      {/* PLATFORM */}
      <select
        value={data.platform}
        onChange={(e) => setData({ ...data, platform: e.target.value })}
      >
        <option value="">Plataforma</option>
        {PLATFORM_OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>

      {/* LOADER */}
      <select
        value={data.loader}
        onChange={(e) => setData({ ...data, loader: e.target.value })}
      >
        <option value="">Loader</option>
        {LOADER_OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>

      {/* CATEGORIES MULTI */}
      <div>
        <p>Categorías:</p>
          <select
            value={data.categories[0] || ""}
            onChange={(e) =>
              setData({ ...data, categories: [e.target.value] })
            }
          >
            <option value="">Categoría</option>
            {CATEGORIES.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
      </div>

      {/* TAGS */}
      <div>
        <input
          value={tagInput}
          onChange={(e) => setTagInput(e.target.value)}
          placeholder="Tag..."
        />
        <button type="button" onClick={addTag}>
          +
        </button>

        <div>
          {data.tags.map((t: string) => (
            <span key={t}>{t}</span>
          ))}
        </div>
      </div>

      <button onClick={next}>Siguiente →</button>
    </div>
  );
}