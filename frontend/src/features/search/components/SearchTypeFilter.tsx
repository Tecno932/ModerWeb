import styles from "./Filter.module.css";

type Props = {
  options: string[];

  value: string;

  onChange: (
    value: string
  ) => void;
};

export default function SearchTypeFilter({
  options,
  value,
  onChange,
}: Props) {
  return (
    <div className={styles.group}>
      {options.map((type) => (
        <label key={type}>
          <input
            type="checkbox"
            checked={value === type}
            onChange={() =>
              onChange(type)
            }
          />

          {type || "all"}
        </label>
      ))}
    </div>
  );
}