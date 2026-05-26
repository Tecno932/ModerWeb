import { useOutletContext } from "react-router-dom";

export default function OverviewTab() {
  const { mod }: any = useOutletContext();

  return (
    <div>
      <h2>Overview</h2>

      <h3>Descripción</h3>
      <p>{mod.description}</p>

      <h3>Contenido</h3>
      <div dangerouslySetInnerHTML={{ __html: mod.content }} />
    </div>
  );
}