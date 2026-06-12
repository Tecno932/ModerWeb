import styles from "./Filter.module.css";

type Props = {
  options: any[];
  value: string;
  onChange: (value: string) => void;
};

export default function SearchTypeFilter({
  options,
  value,
  onChange,
}: Props) {
  return (
    <div className={styles.list}>
      <button
        className={`${styles.item} ${
          value === ""
            ? styles.active
            : ""
        }`}
        onClick={() => onChange("")}
      >
        All
      </button>

      {options.map((option) => {
        const label =
          typeof option === "string"
            ? option
            : option.label;

        const optionValue =
          typeof option === "string"
            ? option
            : option.value;

        return (
          <button
            key={optionValue}
            className={`${styles.item} ${
              value === optionValue
                ? styles.active
                : ""
            }`}
            onClick={() =>
              onChange(optionValue)
            }
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}