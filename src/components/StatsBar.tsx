import { Fragment } from "react";

// 數字先用假資料撐版面，之後有真實數據再換掉。
const STATS = [
  { value: "128", label: "累計售出" },
  { value: "246", label: "累計出租" },
  { value: "189", label: "合作房東・屋主" },
  { value: "356", label: "服務租客・買家" },
];

export default function StatsBar() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6">
      <div className="grid grid-cols-2 gap-4 rounded-3xl border border-border bg-paper px-5 py-5 shadow-sm sm:flex sm:items-center sm:justify-center sm:gap-6 sm:rounded-full sm:px-10 sm:py-4">
        {STATS.map((stat, i) => (
          <Fragment key={stat.label}>
            <div className="flex flex-col items-center gap-0.5 sm:flex-row sm:items-baseline sm:gap-2">
              <span className="tabular-nums text-2xl font-black text-navy sm:text-xl">
                {stat.value}
              </span>
              <span className="whitespace-nowrap text-sm text-muted">{stat.label}</span>
            </div>
            {i < STATS.length - 1 && (
              <span
                className="hidden h-1.5 w-1.5 shrink-0 rounded-full bg-navy sm:block"
                aria-hidden="true"
              />
            )}
          </Fragment>
        ))}
      </div>
    </div>
  );
}
