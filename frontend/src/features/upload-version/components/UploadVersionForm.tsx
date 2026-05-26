import { useState } from "react";

import { useQueryClient } from "@tanstack/react-query";

import { useCreateVersion } from "../hooks";

import { useUploadStore } from "@/features/uploads/store/upload.store";

import { useToast } from "@/shared/components/ToastProvider";

const LOADERS = [
  "FABRIC",
  "FORGE",
  "NEOFORGE",
  "QUILT",
  "LITELOADER",
];

type Props = {
  modId: string | number;
};

export default function UploadVersionForm({
  modId,
}: Props) {
  //////////////////////////////////////////////////////
  // STATE
  //////////////////////////////////////////////////////

  const [file, setFile] =
    useState<File | null>(null);

  //////////////////////////////////////////////////////
  // QUERY
  //////////////////////////////////////////////////////

  const queryClient =
    useQueryClient();

  //////////////////////////////////////////////////////
  // MUTATIONS
  //////////////////////////////////////////////////////

  const {
    mutateAsync:
      createVersionMutation,

    isPending:
      isCreatingVersion,
  } = useCreateVersion();

  //////////////////////////////////////////////////////
  // UPLOAD STORE
  //////////////////////////////////////////////////////

  const addFiles =
    useUploadStore(
      (s) => s.addFiles
    );

  //////////////////////////////////////////////////////
  // TOAST
  //////////////////////////////////////////////////////

  const { addToast } = useToast();

  //////////////////////////////////////////////////////
  // SUBMIT
  //////////////////////////////////////////////////////

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    if (!file) {
      addToast(
        "Seleccioná un archivo"
      );

      return;
    }

    const form = e.currentTarget;

    const formData = new FormData(
      form
    );

    ////////////////////////////////////////////////////
    // OPTIMISTIC VERSION
    ////////////////////////////////////////////////////

    const optimisticId =
      -Date.now();

    const optimisticVersion = {
      id: optimisticId,

      version:
        formData.get(
          "version"
        ) as string,

      minecraftVersion:
        formData.get(
          "minecraftVersion"
        ) as string,

      loader:
        (formData.get(
          "loader"
        ) as string) || undefined,

      changelog:
        (formData.get(
          "changelog"
        ) as string) || undefined,

      createdAt:
        new Date().toISOString(),

      files: [
        {
          id: optimisticId,

          filename:
            file.name,

          size: file.size,

          downloads: 0,

          releaseType:
            "release",
        },
      ],

      isUploading: true,
    };

    ////////////////////////////////////////////////////
    // INSERT OPTIMISTIC VERSION
    ////////////////////////////////////////////////////

    queryClient.setQueryData(
      ["mod", modId, "versions"],
      (old: any) => {
        if (!old) {
          return [
            optimisticVersion,
          ];
        }

        return [
          optimisticVersion,
          ...old,
        ];
      }
    );

    try {
      //////////////////////////////////////////////////
      // 1️⃣ CREATE VERSION
      //////////////////////////////////////////////////

      const version =
        await createVersionMutation({
          modId,

          version:
            formData.get(
              "version"
            ) as string,

          minecraftVersion:
            formData.get(
              "minecraftVersion"
            ) as string,

          loader:
            (formData.get(
              "loader"
            ) as string) ||
            undefined,

          changelog:
            (formData.get(
              "changelog"
            ) as string) ||
            undefined,
        });

      //////////////////////////////////////////////////
      // 2️⃣ ADD TO UPLOAD QUEUE
      //////////////////////////////////////////////////

      addFiles(version.id, [file]);

      //////////////////////////////////////////////////
      // 3️⃣ REFRESH REAL DATA
      //////////////////////////////////////////////////

      await queryClient.invalidateQueries(
        {
          queryKey: [
            "mod",
            modId,
            "versions",
          ],
        }
      );

      //////////////////////////////////////////////////
      // SUCCESS
      //////////////////////////////////////////////////

      addToast(
        "Versión subida 🚀"
      );

      form.reset();

      setFile(null);

    } catch (err) {
      console.error(err);

      //////////////////////////////////////////////////
      // ROLLBACK
      //////////////////////////////////////////////////

      queryClient.setQueryData(
        [
          "mod",
          modId,
          "versions",
        ],
        (old: any) =>
          old?.filter(
            (v: any) =>
              v.id !==
              optimisticId
          )
      );

      addToast(
        "Error al subir versión ❌"
      );
    }
  };

  //////////////////////////////////////////////////////
  // UI
  //////////////////////////////////////////////////////

  const isLoading =
    isCreatingVersion;

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        display: "flex",

        flexDirection: "column",

        gap: 12,

        marginBottom: 20,
      }}
    >
      <input
        name="version"
        placeholder="Versión del mod"
        required
      />

      <input
        name="minecraftVersion"
        placeholder="Versión de Minecraft"
        required
      />

      <select name="loader">
        <option value="">
          Sin loader
        </option>

        {LOADERS.map((l) => (
          <option
            key={l}
            value={l}
          >
            {l}
          </option>
        ))}
      </select>

      <textarea
        name="changelog"
        placeholder="Changelog"
        rows={4}
      />

      <input
        type="file"

        accept=".jar,.zip"

        onChange={(e) =>
          setFile(
            e.target.files?.[0] ||
              null
          )
        }

        required
      />

      <button
        type="submit"

        disabled={
          isLoading || !file
        }
      >
        {isLoading
          ? "Creando versión..."
          : "Subir versión"}
      </button>
    </form>
  );
}