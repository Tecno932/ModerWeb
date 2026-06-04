import CreateModForm from "@/features/create-mod/components/CreateModForm";

import styles from "./CreateModPage.module.css";

export default function CreateModPage() {
  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1>Create Project</h1>

        <p>
          Publish a new mod, resource pack,
          addon or plugin.
        </p>
      </div>

      <CreateModForm />
    </div>
  );
}