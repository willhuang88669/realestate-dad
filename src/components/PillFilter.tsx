export interface PillOption<T extends string> {
  value: T;
  label: string;
}

export default function PillFilter<T extends string>({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: T;
  onChange: (value: T) => void;
  options: PillOption<T>[];
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-sm font-medium text-muted">{label}</span>
      <div className="flex flex-wrap gap-1.5">
        {options.map((opt) => {
          const active = opt.value === value;
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => onChange(opt.value)}
              className={`cursor-pointer rounded-full border px-3 py-1.5 text-sm font-bold transition ${
                active
                  ? "border-navy bg-navy text-navy-foreground"
                  : "border-border bg-paper text-ink hover:bg-canvas"
              }`}
            >
              {opt.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
