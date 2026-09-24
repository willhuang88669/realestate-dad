"use client";

import dynamic from "next/dynamic";
import { useMemo, useState } from "react";
import {
  ListBulletIcon,
  MapIcon,
  Squares2X2Icon,
} from "@heroicons/react/24/outline";
import { getListingById, type ListingType } from "@/data/listings";
import { RECENT_DEALS, getDealByListingId, type RecentDeal } from "@/data/recentDeals";
import { EMPTY_FILTERS, applyFilters, type Filters, type MapBounds } from "@/lib/filters";
import { useListingsStore } from "@/lib/listingsStore";
import FilterBar from "@/components/FilterBar";
import ListingCard from "@/components/ListingCard";
import RecentDealCard from "@/components/RecentDealCard";
import PopularCarousel from "@/components/PopularCarousel";
import StatsBar from "@/components/StatsBar";

const ListingsMap = dynamic(() => import("@/components/ListingsMap"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center bg-canvas text-sm text-muted">
      地圖載入中…
    </div>
  ),
});

export default function HomePage() {
  const { publishedListings } = useListingsStore();
  const [activeType, setActiveType] = useState<ListingType>("sale");
  const [filters, setFilters] = useState<Filters>(EMPTY_FILTERS);
  const [showMap, setShowMap] = useState(false);
  const [boxSelectActive, setBoxSelectActive] = useState(false);
  const [mapBounds, setMapBounds] = useState<MapBounds | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  function switchType(type: ListingType) {
    setActiveType(type);
    setFilters(EMPTY_FILTERS);
    setMapBounds(null);
    setBoxSelectActive(false);
  }

  // 已成交（售出/出租）的物件、後台已下架或刪除的物件不列入可詢問的房源列表，
  // 已成交的僅出現在「最近成交」區塊；上架/下架/刪除狀態改自後台「我的房源」。
  const activeListings = useMemo(
    () => publishedListings.filter((l) => !getDealByListingId(l.id)),
    [publishedListings],
  );

  const filteredByForm = useMemo(
    () => applyFilters(activeType, filters, null, activeListings),
    [activeType, filters, activeListings],
  );

  const visibleListings = useMemo(
    () => applyFilters(activeType, filters, mapBounds, activeListings),
    [activeType, filters, mapBounds, activeListings],
  );

  const mapListings = mapBounds ? filteredByForm : visibleListings;

  const saleDeals = RECENT_DEALS.filter((d) => getListingById(d.listingId)?.type === "sale");
  const rentDeals = RECENT_DEALS.filter((d) => getListingById(d.listingId)?.type === "rent");

  const popularListings = useMemo(
    () => [...activeListings].sort((a, b) => b.inquiryCount - a.inquiryCount).slice(0, 6),
    [activeListings],
  );

  return (
    <>
      <PopularCarousel listings={popularListings} />

      <div className="pt-6 sm:pt-8">
        <StatsBar />
      </div>

      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-6 sm:px-6 sm:py-8">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <h1 className="font-serif text-4xl font-medium leading-[1.05] tracking-tight text-ink sm:text-6xl">
            找到你的
            <br />
            <span className="text-navy">理想</span>好宅
          </h1>
          <p className="max-w-xs text-sm text-muted sm:text-right">
            {activeListings.length} 筆可詢問房源，帶你找到真正屬於你的家。
          </p>
        </div>

        {/* 租售 tabs */}
        <div className="inline-flex w-fit rounded-full border border-border bg-paper p-1 shadow-sm">
          {(
            [
              { key: "sale", label: "買房" },
              { key: "rent", label: "租房" },
            ] as { key: ListingType; label: string }[]
          ).map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => switchType(tab.key)}
              className={`cursor-pointer rounded-full px-6 py-2 text-sm font-bold transition ${
                activeType === tab.key
                  ? "bg-navy text-navy-foreground"
                  : "text-muted hover:text-ink"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex flex-row items-center justify-between gap-2 sm:gap-3">
          <FilterBar
            type={activeType}
            filters={filters}
            onChange={(f) => {
              setFilters(f);
              setMapBounds(null);
            }}
            resultCount={filteredByForm.length}
          />

          <div className="flex shrink-0 items-center gap-2">
            {mapBounds && (
              <button
                type="button"
                onClick={() => setMapBounds(null)}
                className="cursor-pointer rounded-full px-3 py-2 text-sm font-medium text-muted hover:text-ink"
              >
                清除地圖框選
              </button>
            )}
            <button
              type="button"
              onClick={() => setShowMap((v) => !v)}
              className="inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-border bg-paper px-4 py-2 text-sm font-medium text-ink shadow-sm hover:bg-canvas"
            >
              {showMap ? (
                <>
                  <ListBulletIcon className="h-4 w-4" aria-hidden="true" />
                  列表
                </>
              ) : (
                <>
                  <MapIcon className="h-4 w-4" aria-hidden="true" />
                  地圖
                </>
              )}
            </button>
          </div>
        </div>

        <p className="text-sm text-muted">
          <Squares2X2Icon className="mr-1 inline h-4 w-4 -translate-y-px" aria-hidden="true" />
          共 {visibleListings.length} 筆符合條件
        </p>

        {showMap ? (
          <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
            <div className="hidden max-h-[70vh] flex-col gap-3 overflow-y-auto pr-1 lg:flex">
              {visibleListings.map((listing) => (
                <div
                  key={listing.id}
                  onMouseEnter={() => setHoveredId(listing.id)}
                  onMouseLeave={() => setHoveredId(null)}
                >
                  <ListingCard listing={listing} />
                </div>
              ))}
              {visibleListings.length === 0 && <EmptyState onClear={() => setFilters(EMPTY_FILTERS)} />}
            </div>

            <div className="relative h-[70vh] overflow-hidden rounded-2xl border border-border shadow-sm">
              <ListingsMap
                listings={mapListings}
                boxSelectActive={boxSelectActive}
                onBoxSelect={setMapBounds}
                highlightedId={hoveredId}
              />
              <button
                type="button"
                onClick={() => setBoxSelectActive((v) => !v)}
                className={`absolute right-3 top-3 z-1000 cursor-pointer rounded-full px-4 py-2 text-sm font-bold shadow-md transition ${
                  boxSelectActive
                    ? "bg-yellow text-yellow-foreground"
                    : "bg-paper text-ink hover:bg-canvas"
                }`}
              >
                {boxSelectActive ? "框選中・拖曳畫框" : "框選範圍搜尋"}
              </button>
            </div>
          </div>
        ) : visibleListings.length === 0 ? (
          <EmptyState onClear={() => setFilters(EMPTY_FILTERS)} />
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {visibleListings.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        )}

        <section className="mt-4 flex flex-col gap-6 border-t border-border pt-8">
          <div>
            <h2 className="text-xl font-black tracking-tight text-ink sm:text-2xl">
              最近成交
            </h2>
            <p className="mt-1 text-sm text-muted">近期成功媒合的物件</p>
          </div>

          <RecentDealsGroup title="售出" deals={saleDeals} />
          <RecentDealsGroup title="租出" deals={rentDeals} />
        </section>
      </div>
    </>
  );
}

function RecentDealsGroup({ title, deals }: { title: string; deals: RecentDeal[] }) {
  if (deals.length === 0) return null;
  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-sm font-bold text-muted">{title}</h3>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        {deals.map((deal) => (
          <RecentDealCard key={deal.id} deal={deal} />
        ))}
      </div>
    </div>
  );
}

function EmptyState({ onClear }: { onClear: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-border bg-paper py-16 text-center">
      <p className="text-base font-bold text-ink">找不到符合條件的房源</p>
      <p className="text-sm text-muted">試著放寬篩選條件，或清除全部重新搜尋</p>
      <button
        type="button"
        onClick={onClear}
        className="cursor-pointer rounded-full bg-navy px-5 py-2 text-sm font-bold text-navy-foreground"
      >
        清除篩選條件
      </button>
    </div>
  );
}
