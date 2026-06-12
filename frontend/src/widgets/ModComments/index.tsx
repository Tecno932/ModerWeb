type Props = {
  modId: number;
};

export default function ModComments({
  modId,
}: Props) {
  return (
    <section>
      <h2>Comments</h2>

      <p>
        Coming soon...
      </p>

      <small>
        Mod ID: {modId}
      </small>
    </section>
  );
}