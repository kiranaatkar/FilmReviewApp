import { useState } from "react";
import { Check, ChevronDown } from "lucide-react";

type Option = { value: string; label: string };

export function InlineSelect({
  value,
  onChange,
  options,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  options: Option[];
  placeholder?: string;
}) {
  const [open, setOpen] = useState(false);
  const selected = options.find((o) => o.value === value);

  return (
    <div className="inline-select">
      <button className="radix-select-trigger" onClick={() => setOpen(!open)}>
        {selected?.label ?? placeholder}
        <ChevronDown className="select-chevron-icon" />
      </button>

      {open && (
        <div className="inline-select-options">
          {options.map((opt) => (
            <div
              key={opt.value}
              className={`radix-select-item ${
                value === opt.value ? "selected" : ""
              }`}
              onClick={() => {
                onChange(opt.value);
                setOpen(false);
              }}
            >
              {opt.label}
              {value === opt.value && <Check className="select-check-icon" />}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
