"use client";

import { useState } from "react";
import {
  AdjustmentsHorizontalIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { AREAS, PROPERTY_TYPES, type ListingType, type PropertyType } from "@/data/listings";
import { EMPTY_FILTERS, countActiveFilters, type Filters } from "@/lib/filters";
import FilterDropdown from "@/components/FilterDropdown";

const AGE_OPTIONS = [5, 10, 15, 20];

function toggleValue<T>(list: T[], value: T): T[] {
  return list.includes(value) ? list.filter((v) => v !== value) : [...list, value];
}

function AreaField({
  filters,
  onChange,
}: {
  filters: Filters;
  onChange: (f: Filters) => void;
}) {
  return (
    <div className="flex max-h-64 flex-col gap-1 overflow-y-auto">
      {AREAS.map((area) => (
        <label
          key={area}
          className="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-2 text-sm hover:bg-canvas"
        >
          <input
            type="checkbox"
            checked={filters.areas.includes(area)}
            onChange={() =>
              onChange({ ...filters, areas: toggleValue(filters.areas, area) })
            }
            className="h-4 w-4 rounded border-border text-navy accent-[var(--color-navy)]"
          />
          {area}
        </label>
      ))}
    </div>
  );
}

function PropertyTypeField({
  filters,
  onChange,
}: {
  filters: Filters;
  onChange: (f: Filters) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {PROPERTY_TYPES.map((pt) => {
        const active = filters.propertyTypes.includes(pt);
        return (
          <button
            key={pt}
            type="button"
            onClick={() =>
              onChange({
                ...filters,
                propertyTypes: toggleValue<PropertyType>(filters.propertyTypes, pt),
              })
            }
            className={`cursor-pointer rounded-full border px-3 py-1.5 text-sm transition ${
              active
                ? "border-navy bg-navy text-navy-foreground"
                : "border-border bg-paper text-ink hover:bg-canvas"
            }`}
          >
            {pt}
          </button>
        );
      })}
    </div>
  );
}

function PriceField({
  type,
  filters,
  onChange,
}: {
  type: ListingType;
  filters: Filters;
  onChange: (f: Filters) => void;
}) {
  const unit = type === "sale" ? "萬" : "元/月";
  const presets =
    type === "sale"
      ? [
          { label: "1500 萬以下", min: null, max: 1500 },
          { label: "1500-2500 萬", min: 1500, max: 2500 },
          { label: "2500 萬以上", min: 2500, max: null },
        ]
      : [
          { label: "2 萬以下", min: null, max: 20000 },
          { label: "2-3 萬", min: 20000, max: 30000 },
          { label: "3 萬以上", min: 30000, max: null },
        ];

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <input
          type="number"
          inputMode="numeric"
          placeholder="最低"
          value={filters.minPrice ?? ""}
          onChange={(e) =>
            onChange({
              ...filters,
              minPrice: e.target.value === "" ? null : Number(e.target.value),
            })
          }
          className="w-full rounded-lg border border-border px-3 py-2 text-sm tabular-nums focus:border-navy focus:outline-none"
        />
        <span className="text-sm text-muted">{unit}</span>
        <span className="text-muted">–</span>
        <input
          type="number"
          inputMode="numeric"
          placeholder="最高"
          value={filters.maxPrice ?? ""}
          onChange={(e) =>
            onChange({
              ...filters,
              maxPrice: e.target.value === "" ? null : Number(e.target.value),
            })
          }
          className="w-full rounded-lg border border-border px-3 py-2 text-sm tabular-nums focus:border-navy focus:outline-none"
        />
        <span className="text-sm text-muted">{unit}</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {presets.map((p) => (
          <button
            key={p.label}
            type="button"
            onClick={() => onChange({ ...filters, minPrice: p.min, maxPrice: p.max })}
            className="cursor-pointer rounded-full border border-border px-3 py-1 text-sm text-muted hover:border-navy hover:text-ink"
          >
            {p.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function SizeField({
  filters,
  onChange,
}: {
  filters: Filters;
  onChange: (f: Filters) => void;
}) {
  return (
    <div className="flex items-center gap-2">
      <input
        type="number"
        inputMode="numeric"
        placeholder="最低"
        value={filters.minSize ?? ""}
        onChange={(e) =>
          onChange({
            ...filters,
            minSize: e.target.value === "" ? null : Number(e.target.value),
          })
        }
        className="w-full rounded-lg border border-border px-3 py-2 text-sm tabular-nums focus:border-navy focus:outline-none"
      />
      <span className="text-sm text-muted">坪</span>
      <span className="text-muted">–</span>
      <input
        type="number"
        inputMode="numeric"
        placeholder="最高"
        value={filters.maxSize ?? ""}
        onChange={(e) =>
          onChange({
            ...filters,
            maxSize: e.target.value === "" ? null : Number(e.target.value),
          })
        }
        className="w-full rounded-lg border border-border px-3 py-2 text-sm tabular-nums focus:border-navy focus:outline-none"
      />
      <span className="text-sm text-muted">坪</span>
    </div>
  );
}

function AgeField({
  filters,
  onChange,
}: {
  filters: Filters;
  onChange: (f: Filters) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      <button
        type="button"
        onClick={() => onChange({ ...filters, maxAge: null })}
        className={`cursor-pointer rounded-full border px-3 py-1.5 text-sm transition ${
          filters.maxAge == null
            ? "border-navy bg-navy text-navy-foreground"
            : "border-border bg-paper text-ink hover:bg-canvas"
        }`}
      >
        不限
      </button>
      {AGE_OPTIONS.map((age) => (
        <button
          key={age}
          type="button"
          onClick={() => onChange({ ...filters, maxAge: age })}
          className={`cursor-pointer rounded-full border px-3 py-1.5 text-sm transition ${
            filters.maxAge === age
              ? "border-navy bg-navy text-navy-foreground"
              : "border-border bg-paper text-ink hover:bg-canvas"
          }`}
        >
          {age} 年內
        </button>
      ))}
    </div>
  );
}

export default function FilterBar({
  type,
  filters,
  onChange,
  resultCount,
}: {
  type: ListingType;
  filters: Filters;
  onChange: (f: Filters) => void;
  resultCount: number;
}) {
  const [sheetOpen, setSheetOpen] = useState(false);
  const activeCount = countActiveFilters(filters);

  return (
    <div>
      {/* Desktop / tablet: inline dropdown row */}
      <div className="hidden flex-wrap items-center gap-2 sm:flex">
        <FilterDropdown label="區域" active={filters.areas.length > 0}>
          <AreaField filters={filters} onChange={onChange} />
        </FilterDropdown>
        <FilterDropdown label="房型" active={filters.propertyTypes.length > 0}>
          <PropertyTypeField filters={filters} onChange={onChange} />
        </FilterDropdown>
        <FilterDropdown
          label="價格"
          active={filters.minPrice != null || filters.maxPrice != null}
          panelClassName="w-80"
        >
          <PriceField type={type} filters={filters} onChange={onChange} />
        </FilterDropdown>
        <FilterDropdown
          label="坪數"
          active={filters.minSize != null || filters.maxSize != null}
          panelClassName="w-80"
        >
          <SizeField filters={filters} onChange={onChange} />
        </FilterDropdown>
        <FilterDropdown label="屋齡" active={filters.maxAge != null} panelClassName="w-96">
          <AgeField filters={filters} onChange={onChange} />
        </FilterDropdown>

        {activeCount > 0 && (
          <button
            type="button"
            onClick={() => onChange(EMPTY_FILTERS)}
            className="cursor-pointer rounded-full px-3 py-2 text-sm font-medium text-muted hover:text-ink"
          >
            清除全部
          </button>
        )}
      </div>

      {/* Mobile: single trigger opening a bottom sheet */}
      <div className="sm:hidden">
        <button
          type="button"
          onClick={() => setSheetOpen(true)}
          className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-border bg-paper px-4 py-2.5 text-sm font-medium text-ink shadow-sm"
        >
          <AdjustmentsHorizontalIcon className="h-4 w-4" aria-hidden="true" />
          篩選
          {activeCount > 0 && (
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-yellow text-sm font-bold text-yellow-foreground">
              {activeCount}
            </span>
          )}
        </button>
      </div>

      {sheetOpen && (
        <div className="fixed inset-0 z-50 sm:hidden">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setSheetOpen(false)}
          />
          <div className="absolute inset-x-0 bottom-0 flex max-h-[85vh] flex-col rounded-t-2xl bg-paper shadow-2xl">
            <div className="flex items-center justify-between border-b border-border px-4 py-3">
              <h2 className="text-base font-bold">篩選條件</h2>
              <button
                type="button"
                onClick={() => setSheetOpen(false)}
                aria-label="關閉篩選"
                className="cursor-pointer rounded-full p-1.5 hover:bg-canvas"
              >
                <XMarkIcon className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>

            <div className="flex-1 space-y-6 overflow-y-auto px-4 py-4">
              <div>
                <h3 className="mb-2 text-sm font-bold text-ink">區域</h3>
                <AreaField filters={filters} onChange={onChange} />
              </div>
              <div>
                <h3 className="mb-2 text-sm font-bold text-ink">房型</h3>
                <PropertyTypeField filters={filters} onChange={onChange} />
              </div>
              <div>
                <h3 className="mb-2 text-sm font-bold text-ink">價格區間</h3>
                <PriceField type={type} filters={filters} onChange={onChange} />
              </div>
              <div>
                <h3 className="mb-2 text-sm font-bold text-ink">坪數</h3>
                <SizeField filters={filters} onChange={onChange} />
              </div>
              <div>
                <h3 className="mb-2 text-sm font-bold text-ink">屋齡</h3>
                <AgeField filters={filters} onChange={onChange} />
              </div>
            </div>

            <div className="flex items-center gap-3 border-t border-border px-4 py-3">
              <button
                type="button"
                onClick={() => onChange(EMPTY_FILTERS)}
                className="cursor-pointer rounded-full px-4 py-2.5 text-sm font-medium text-muted"
              >
                清除全部
              </button>
              <button
                type="button"
                onClick={() => setSheetOpen(false)}
                className="flex-1 cursor-pointer rounded-full bg-navy py-2.5 text-sm font-bold text-navy-foreground"
              >
                查看 {resultCount} 筆結果
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
