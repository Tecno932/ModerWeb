import { useEditor, EditorContent } from "@tiptap/react";
import styles from "./mediainfo.module.css";

import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import Image from "@tiptap/extension-image";

type Props = {
  data: any;
  setData: (data: any) => void;
  submit: () => void;
};

export default function StepMediaInfo({ data, setData, submit }: Props) {
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
    <div className={styles.wrapper}>
      <h2 className={styles.title}>Media & Description</h2>

      {/* GALLERY */}
      <div className={styles.gallery}>
        <input
          type="file"
          multiple
          onChange={(e) => {
            const files = Array.from(e.target.files || []);
            handleGallery(files);
          }}
        />

        <div className={styles.previewGrid}>
          {data.gallery?.map((file: File, i: number) => (
            <img
              key={i}
              src={URL.createObjectURL(file)}
              className={styles.previewImage}
            />
          ))}
        </div>
      </div>

      {/* TOOLBAR FLOAT */}
      <div className={styles.toolbar}>
        <button
          className={editor.isActive("bold") ? styles.active : ""}
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          B
        </button>

        <button
          className={editor.isActive("italic") ? styles.active : ""}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          I
        </button>

        <button
          className={editor.isActive("underline") ? styles.active : ""}
          onClick={() => editor.chain().focus().toggleUnderline().run()}
        >
          U
        </button>

        <button onClick={addLink}>🔗</button>

        <button
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
        >
          H1
        </button>

        <button
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
        >
          H2
        </button>

        <button onClick={() => editor.chain().focus().toggleBulletList().run()}>
          •
        </button>

        <button onClick={() => editor.chain().focus().toggleOrderedList().run()}>
          1.
        </button>

        <button onClick={addLink}>🔗</button>

        <button
          onClick={() => editor.chain().focus().unsetLink().run()}
        >
          ❌
        </button>

        {/* IMAGE BUTTON */}
        <label className={styles.imageUpload}>
          🖼️
          <input
            type="file"
            hidden
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) addImage(file);
            }}
          />
        </label>

        <button
          onClick={() =>
            editor.chain().focus().clearNodes().unsetAllMarks().run()
          }
        >
          🧹
        </button>
      </div>

      {/* EDITOR */}
      <div className={styles.editor}>
        <EditorContent editor={editor} />
      </div>

      <button className={styles.submit} onClick={submit}>
        🚀 Crear Mod
      </button>
    </div>
  );
}