"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { CheckIcon, XMarkIcon, ArrowUturnLeftIcon } from "@heroicons/react/24/outline";
import type { ReviewStatus } from "@/data/pendingListings";
import type { ListingType } from "@/data/listings";
import { formatPrice, typeLabel, telHref } from "@/lib/format";
import { useListingsStore } from "@/lib/listingsStore";
import AdminNav from "@/components/AdminNav";
import PillFilter from "@/components/PillFilter";

const STATUS_META: Record<ReviewStatus, { label: string; className: string }> = {
  pending: { label: "審核中", className: "bg-progress text-progress-foreground" },
  approved: { label: "已通過", className: "bg-rent text-rent-foreground" },
  rejected: { label: "已退回", className: "bg-danger text-white" },
};

type TypeFilter = "all" | ListingType;
type StatusFilter = "all" | ReviewStatus;

export default function AdminPendingListingsPage() {
  const { pendingListings: listings, setPendingStatus, approvePendingListing } =
    useListingsStore();
  const [typeFilter, setTypeFilter] = useState<TypeFilter>("all");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

  function setStatus(id: string, status: ReviewStatus) {
    if (status === "approved") {
      approvePendingListing(id);
    } else {
      setPendingStatus(id, status);
    }
  }

  const pendingCount = listings.filter((l) => l.status === "pending").length;

  const filteredListings = useMemo(
    () =>
      listings.filter(
        (l) =>
          (typeFilter === "all" || l.type === typeFilter) &&
          (statusFilter === "all" || l.status === statusFilter),
      ),
    [listings, typeFilter, statusFilter],
  );

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-4 px-4 py-6 sm:px-6 sm:py-8">
      <h1 className="text-2xl font-black tracking-tight text-ink sm:text-3xl">
        後台管理
      </h1>

      <AdminNav />

      <div className="flex flex-col gap-2 rounded-2xl border border-border bg-paper p-4">
        <PillFilter
          label="類型"
          value={typeFilter}
          onChange={setTypeFilter}
          options={[
            { value: "all", label: "全部" },
            { value: "sale", label: "售" },
            { value: "rent", label: "租" },
          ]}
        />
        <PillFilter
          label="狀態"
          value={statusFilter}
          onChange={setStatusFilter}
          options={[
            { value: "all", label: "全部" },
            { value: "pending", label: "審核中" },
            { value: "approved", label: "已通過" },
            { value: "rejected", label: "已退回" },
          ]}
        />
      </div>

      <p className="text-sm text-muted">
        顯示 {filteredListings.length} 筆（共 {listings.length} 筆・{pendingCount} 筆待審核）
      </p>

      <div className="flex flex-col gap-3">
        {filteredListings.length === 0 && (
          <p className="rounded-2xl border border-dashed border-border bg-paper py-10 text-center text-sm text-muted">
            沒有符合篩選條件的房源
          </p>
        )}
        {filteredListings.map((listing) => {
          const meta = STATUS_META[listing.status];
          return (
            <div
              key={listing.id}
              className="flex flex-col gap-3 rounded-2xl border border-border bg-paper p-4 sm:flex-row sm:items-center"
            >
              <div className="relative h-28 w-full shrink-0 overflow-hidden rounded-xl bg-canvas sm:h-20 sm:w-28">
                <Image
                  src={listing.images[0]}
                  alt={listing.title}
                  fill
                  sizes="140px"
                  className="object-cover"
                />
              </div>

              <div className="flex-1 min-w-0">
                <div className="mb-1 flex flex-wrap items-center gap-2">
                  <span
                    className={`rounded-full px-2 py-0.5 text-sm font-bold ${
                      listing.type === "rent"
                        ? "bg-rent text-rent-foreground"
                        : "bg-sale text-sale-foreground"
                    }`}
                  >
                    {typeLabel(listing.type)}
                  </span>
                  <span className={`rounded-full px-2 py-0.5 text-sm font-bold ${meta.className}`}>
                    {meta.label}
                  </span>
                </div>
                <p className="truncate text-sm font-bold text-ink">{listing.title}</p>
                <p className="truncate text-sm text-muted">
                  {listing.area}・{listing.address}
                </p>
                <p className="tabular-nums text-sm text-muted">
                  {listing.size} 坪・{listing.layout}・屋齡 {listing.age} 年・
                  <span className="font-bold text-navy">{formatPrice(listing)}</span>
                </p>
                <p className="tabular-nums text-sm text-muted">
                  提交人：{listing.submitterName}（
                  <a
                    href={telHref(listing.submitterPhone)}
                    className="text-navy underline-offset-2 hover:underline"
                  >
                    {listing.submitterPhone}
                  </a>
                  ）・{listing.submittedAt}
                </p>
                {listing.status === "approved" && (
                  <Link
                    href="/admin/listings"
                    className="mt-1 inline-block text-sm font-bold text-rent hover:underline"
                  >
                    已加入「我的房源」→
                  </Link>
                )}
              </div>

              <div className="flex shrink-0 items-center gap-2 sm:flex-col sm:items-stretch">
                {listing.status === "pending" ? (
                  <>
                    <button
                      type="button"
                      onClick={() => setStatus(listing.id, "approved")}
                      className="inline-flex cursor-pointer items-center justify-center gap-1 rounded-full bg-rent px-4 py-2 text-sm font-bold text-rent-foreground hover:brightness-95"
                    >
                      <CheckIcon className="h-3.5 w-3.5" aria-hidden="true" />
                      通過
                    </button>
                    <button
                      type="button"
                      onClick={() => setStatus(listing.id, "rejected")}
                      className="inline-flex cursor-pointer items-center justify-center gap-1 rounded-full border border-border px-4 py-2 text-sm font-bold text-ink hover:bg-canvas"
                    >
                      <XMarkIcon className="h-3.5 w-3.5" aria-hidden="true" />
                      退回
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={() => setStatus(listing.id, "pending")}
                    className="inline-flex cursor-pointer items-center justify-center gap-1 rounded-full border border-border px-4 py-2 text-sm font-medium text-muted hover:bg-canvas hover:text-ink"
                  >
                    <ArrowUturnLeftIcon className="h-3.5 w-3.5" aria-hidden="true" />
                    取消決定
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
