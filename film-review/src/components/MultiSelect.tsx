import { useState } from "react";
import { ChevronDown } from "lucide-react";
import "../styles/MultiSelect.css";

type MultiSelectProps<T> = {
  options: T[];
  value: T[];
  onChange: (value: T[]) => void;
  getLabel: (option: T) => string;
  getKey: (option: T) => string | number;
  placeholder?: string;
};

export function MultiSelect<T>({
  options,
  value,
  onChange,
  getLabel,
  getKey,
  placeholder = "Select...",
}: MultiSelectProps<T>) {
  const [open, setOpen] = useState(false);

  const toggleOption = (option: T) => {
    const key = getKey(option);
    const exists = value.some((v) => getKey(v) === key);

    if (exists) {
      onChange(value.filter((v) => getKey(v) !== key));
    } else {
      onChange([...value, option]);
    }
  };

  const displayText =
    value.length > 0 ? `${value.length} selected` : placeholder;

  return (
    <div className="multi-container">
      <button className="multi-trigger" onClick={() => setOpen(!open)}>
        {displayText}
        <ChevronDown size={16} />
      </button>

      {open && (
        <div className="multi-inline">
          {options.map((option) => {
            const key = getKey(option);
            const checked = value.some((v) => getKey(v) === key);

            return (
              <label key={key} className="multi-item">
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => toggleOption(option)}
                />
                {getLabel(option)}
              </label>
            );
          })}
        </div>
      )}
    </div>
  );
}