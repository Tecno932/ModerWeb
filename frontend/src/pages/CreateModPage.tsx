import CreateModForm from "@/features/create-mod/components/CreateModForm";

export default function CreateModPage() {
  return (
    <div style={{ padding: 20, maxWidth: 800, margin: "0 auto" }}>
      <h1>Crear Mod</h1>
      <CreateModForm />
    </div>
  );
}