"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  TrashIcon,
  ArrowUturnLeftIcon,
  XMarkIcon,
  PencilSquareIcon,
  EyeIcon,
  EyeSlashIcon,
} from "@heroicons/react/24/outline";
import { getDealByListingId } from "@/data/recentDeals";
import type { Listing } from "@/data/listings";
import { formatPrice, typeLabel } from "@/lib/format";
import { useListingsStore, type ManagedListing } from "@/lib/listingsStore";
import AdminNav from "@/components/AdminNav";
import PillFilter from "@/components/PillFilter";
import EditListingModal from "@/components/EditListingModal";
import ConfirmDialog from "@/components/ConfirmDialog";

type Section = "sale" | "rent" | "closed" | "trash";

const SECTION_OPTIONS: { value: Section; label: string }[] = [
  { value: "sale", label: "售" },
  { value: "rent", label: "租" },
  { value: "closed", label: "已成交" },
  { value: "trash", label: "垃圾桶" },
];

export default function AdminListingsPage() {
  const {
    myListings,
    setPublishStatus,
    trashListing,
    restoreListing,
    permanentlyDeleteListing,
    updateListing,
  } = useListingsStore();
  const [section, setSection] = useState<Section>("sale");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [confirmTarget, setConfirmTarget] = useState<
    { id: string; title: string; action: "trash" | "permanent" } | null
  >(null);

  function handleConfirm() {
    if (!confirmTarget) return;
    if (confirmTarget.action === "trash") {
      trashListing(confirmTarget.id);
    } else {
      permanentlyDeleteListing(confirmTarget.id);
    }
    setConfirmTarget(null);
  }

  const grouped = useMemo(() => {
    const result: Record<Section, ManagedListing[]> = {
      sale: [],
      rent: [],
      closed: [],
      trash: [],
    };
    for (const l of myListings) {
      if (l.trashed) {
        result.trash.push(l);
      } else if (getDealByListingId(l.id)) {
        result.closed.push(l);
      } else if (l.type === "sale") {
        result.sale.push(l);
      } else {
        result.rent.push(l);
      }
    }
    return result;
  }, [myListings]);

  const current = grouped[section];
  const editingListing = editingId ? myListings.find((l) => l.id === editingId) ?? null : null;

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-4 px-4 py-6 sm:px-6 sm:py-8">
      <h1 className="text-2xl font-black tracking-tight text-ink sm:text-3xl">
        後台管理
      </h1>

      <AdminNav />

      <PillFilter label="檢視" value={section} onChange={setSection} options={SECTION_OPTIONS} />

      <p className="text-sm text-muted">
        共 {current.length} 筆
        {section === "closed" && "・已成交物件不需再處理，僅供查看或刪除"}
        {section === "trash" && "・可以還原，或永久刪除"}
      </p>

      <div className="flex flex-col gap-3">
        {current.length === 0 && (
          <p className="rounded-2xl border border-dashed border-border bg-paper py-10 text-center text-sm text-muted">
            {section === "trash" ? "垃圾桶是空的" : "目前沒有物件"}
          </p>
        )}

        {current.map((listing) => (
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

            <div className="min-w-0 flex-1">
              <div className="mb-1 flex flex-wrap items-center gap-2">
                <span
                  className={`rounded-full px-2 py-0.5 text-sm font-bold ${
                    section === "closed"
                      ? "bg-ink text-paper"
                      : listing.type === "rent"
                        ? "bg-rent text-rent-foreground"
                        : "bg-sale text-sale-foreground"
                  }`}
                >
                  {section === "closed" ? "已成交" : typeLabel(listing.type)}
                </span>
                {listing.publishStatus === "unpublished" && (
                  <span className="rounded-full bg-progress px-2 py-0.5 text-sm font-bold text-progress-foreground">
                    已下架
                  </span>
                )}
                {listing.isSynthetic && (
                  <span className="rounded-full border border-border px-2 py-0.5 text-sm text-muted">
                    尚無詳情頁
                  </span>
                )}
              </div>
              {listing.isSynthetic ? (
                <p className="truncate text-sm font-bold text-ink">{listing.title}</p>
              ) : (
                <Link
                  href={`/listings/${listing.id}`}
                  className="truncate text-sm font-bold text-ink hover:underline"
                >
                  {listing.title}
                </Link>
              )}
              <p className="truncate text-sm text-muted">
                {listing.area}・{listing.displayAddress}
              </p>
              <p className="tabular-nums text-sm text-muted">
                {listing.size} 坪・{listing.layout}・屋齡 {listing.age} 年・
                <span className="font-bold text-navy">{formatPrice(listing)}</span>
              </p>
            </div>

            <div className="flex shrink-0 flex-wrap items-center gap-2 sm:flex-col sm:items-stretch">
              {section === "trash" ? (
                <>
                  <button
                    type="button"
                    onClick={() => restoreListing(listing.id)}
                    className="inline-flex cursor-pointer items-center justify-center gap-1 rounded-full border border-border px-4 py-2 text-sm font-bold text-ink hover:bg-canvas"
                  >
                    <ArrowUturnLeftIcon className="h-3.5 w-3.5" aria-hidden="true" />
                    還原
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setConfirmTarget({ id: listing.id, title: listing.title, action: "permanent" })
                    }
                    className="inline-flex cursor-pointer items-center justify-center gap-1 rounded-full bg-danger px-4 py-2 text-sm font-bold text-white hover:brightness-95"
                  >
                    <XMarkIcon className="h-3.5 w-3.5" aria-hidden="true" />
                    永久刪除
                  </button>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => setEditingId(listing.id)}
                    className="inline-flex cursor-pointer items-center justify-center gap-1 rounded-full border border-border px-4 py-2 text-sm font-bold text-ink hover:bg-canvas"
                  >
                    <PencilSquareIcon className="h-3.5 w-3.5" aria-hidden="true" />
                    編輯
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setPublishStatus(
                        listing.id,
                        listing.publishStatus === "published" ? "unpublished" : "published",
                      )
                    }
                    className="inline-flex cursor-pointer items-center justify-center gap-1 rounded-full border border-border px-4 py-2 text-sm font-bold text-ink hover:bg-canvas"
                  >
                    {listing.publishStatus === "published" ? (
                      <>
                        <EyeSlashIcon className="h-3.5 w-3.5" aria-hidden="true" />
                        下架
                      </>
                    ) : (
                      <>
                        <EyeIcon className="h-3.5 w-3.5" aria-hidden="true" />
                        上架
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setConfirmTarget({ id: listing.id, title: listing.title, action: "trash" })
                    }
                    className="inline-flex cursor-pointer items-center justify-center gap-1 rounded-full border border-danger px-4 py-2 text-sm font-bold text-danger hover:bg-danger hover:text-white"
                  >
                    <TrashIcon className="h-3.5 w-3.5" aria-hidden="true" />
                    刪除
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      {editingListing && (
        <EditListingModal
          listing={editingListing}
          onSave={(patch: Partial<Listing>) => updateListing(editingListing.id, patch)}
          onClose={() => setEditingId(null)}
        />
      )}

      {confirmTarget && (
        <ConfirmDialog
          title={confirmTarget.action === "trash" ? "刪除房源" : "永久刪除房源"}
          message={
            confirmTarget.action === "trash"
              ? `確定要將「${confirmTarget.title}」移到垃圾桶嗎？之後可以在垃圾桶還原。`
              : `確定要永久刪除「${confirmTarget.title}」嗎？此動作無法復原。`
          }
          confirmLabel={confirmTarget.action === "trash" ? "移到垃圾桶" : "永久刪除"}
          onConfirm={handleConfirm}
          onCancel={() => setConfirmTarget(null)}
        />
      )}
    </div>
  );
}
