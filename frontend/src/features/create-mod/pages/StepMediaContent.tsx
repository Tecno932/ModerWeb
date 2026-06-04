import { useEditor, EditorContent } from "@tiptap/react";
import styles from "./StepMediaContent.module.css";

import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import Image from "@tiptap/extension-image";
import Button from "@/shared/ui/button/Button";
import Section from "@/shared/ui/section/Section";

import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Heading1,
  Heading2,
  List,
  ListOrdered,
  Link2,
  ImagePlus,
  Eraser,
  Upload,
} from "lucide-react";

type Props = {
  data: any;
  setData: (data: any) => void;
  submit: () => void;
  prev: () => void;
};

export default function StepMediaInfo({ data, setData, submit, prev }: Props) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Image,
      Link.configure({ openOnClick: false }),
      Placeholder.configure({
        placeholder: "Escribe algo increíble sobre tu mod...",
      }),
    ],
    content: data.content || "",
    onUpdate({ editor }) {
      setData({ ...data, content: editor.getHTML() });
    },
    editorProps: {
      handleDrop(view, event) {
        const files = event.dataTransfer?.files;
        if (!files || files.length === 0) return false;

        const file = files[0];
        if (!file.type.startsWith("image/")) return false;

        const reader = new FileReader();
        reader.onload = () => {
          const node = view.state.schema.nodes.image.create({
            src: reader.result,
          });

          const transaction = view.state.tr.replaceSelectionWith(node);
          view.dispatch(transaction);
        };

        reader.readAsDataURL(file);
        return true;
      },
    },
  });

  if (!editor) return null;

  ////////////////////////////////////////
  // LINK
  ////////////////////////////////////////
  const addLink = () => {
    const url = prompt("URL:");
    if (!url) return;

    editor.chain().focus().setLink({ href: url }).run();
  };

  ////////////////////////////////////////
  // IMAGE UPLOAD (EDITOR)
  ////////////////////////////////////////
  const addImage = (file: File) => {
    const reader = new FileReader();

    reader.onload = () => {
      editor
        .chain()
        .focus()
        .setImage({ src: reader.result as string })
        .run();
    };

    reader.readAsDataURL(file);
  };

  ////////////////////////////////////////
  // GALLERY
  ////////////////////////////////////////
  const handleGallery = (files: File[]) => {
    setData({ ...data, gallery: files });
  };

  return (
      <Section
        title="Media & Description"
        description="Upload screenshots and write a detailed description."
      >
      {/* GALLERY */}
      <div className={styles.gallerySection}>
        <div className={styles.galleryHeader}>
          <h3>Gallery Images</h3>

          <label>
            <input
              type="file"
              multiple
              hidden
              onChange={(e) => {
                const files = Array.from(
                  e.target.files || []
                );

                handleGallery(files);
              }}
            />

            <Button
              type="button"
              variant="secondary"
            >
              <Upload size={16} />
              Upload Images
            </Button>
          </label>
        </div>

        <div className={styles.previewGrid}>
          {data.gallery?.map(
            (file: File, i: number) => (
              <img
                key={i}
                src={URL.createObjectURL(
                  file
                )}
                className={
                  styles.previewImage
                }
              />
            )
          )}
        </div>
      </div>

      {/* TOOLBAR FLOAT */}
      <div className={styles.toolbar}>
        <button
          className={
            editor.isActive("bold")
              ? styles.active
              : ""
          }
          onClick={() =>
            editor
              .chain()
              .focus()
              .toggleBold()
              .run()
          }
        >
          <Bold size={16} />
        </button>

        <button
          className={
            editor.isActive("italic")
              ? styles.active
              : ""
          }
          onClick={() =>
            editor
              .chain()
              .focus()
              .toggleItalic()
              .run()
          }
        >
          <Italic size={16} />
        </button>

        <button
          className={
            editor.isActive(
              "underline"
            )
              ? styles.active
              : ""
          }
          onClick={() =>
            editor
              .chain()
              .focus()
              .toggleUnderline()
              .run()
          }
        >
          <UnderlineIcon
            size={16}
          />
        </button>

        <button
          onClick={() =>
            editor
              .chain()
              .focus()
              .toggleHeading({
                level: 1,
              })
              .run()
          }
        >
          <Heading1 size={16} />
        </button>

        <button
          onClick={() =>
            editor
              .chain()
              .focus()
              .toggleHeading({
                level: 2,
              })
              .run()
          }
        >
          <Heading2 size={16} />
        </button>

        <button
          onClick={() =>
            editor
              .chain()
              .focus()
              .toggleBulletList()
              .run()
          }
        >
          <List size={16} />
        </button>

        <button
          onClick={() =>
            editor
              .chain()
              .focus()
              .toggleOrderedList()
              .run()
          }
        >
          <ListOrdered size={16} />
        </button>

        <button onClick={addLink}>
          <Link2 size={16} />
        </button>

        <label>
          <ImagePlus size={16} />

          <input
            hidden
            type="file"
            onChange={(e) => {
              const file =
                e.target.files?.[0];

              if (file)
                addImage(file);
            }}
          />
        </label>

        <button
          onClick={() =>
            editor
              .chain()
              .focus()
              .clearNodes()
              .unsetAllMarks()
              .run()
          }
        >
          <Eraser size={16} />
        </button>
      </div>

      {/* EDITOR */}
      <div className={styles.editor}>
        <EditorContent editor={editor} />
      </div>

      <div className={styles.actions}>
        <Button
          variant="secondary"
          onClick={prev}
        >
          ← Back
        </Button>

        <button className={styles.submit} onClick={submit}>
          🚀 Crear Mod
        </button>
      </div>
    </Section>
  );
}