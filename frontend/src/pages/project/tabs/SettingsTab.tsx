import { useOutletContext } from "react-router-dom";
import { useState } from "react";

export default function SettingsTab() {
  const { mod }: any = useOutletContext();

  const [title, setTitle] = useState(mod.title);

  const handleSave = async () => {
    await fetch(`http://192.168.0.110:3000/mods/${mod.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ title }),
    });

    alert("Guardado");
  };

  return (
    <div>
      <h2>Settings</h2>

      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <button onClick={handleSave}>Guardar</button>
    </div>
  );
}