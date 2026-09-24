"use client";

import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import { LISTINGS, type Listing } from "@/data/listings";
import { PENDING_LISTINGS, type PendingListing, type ReviewStatus } from "@/data/pendingListings";

export type PublishStatus = "published" | "unpublished";

export interface ManagedListing extends Listing {
  publishStatus: PublishStatus;
  trashed: boolean;
  /** 從刊登審核轉正的房源沒有預先產生的靜態詳情頁，要等重新部署才會有。 */
  isSynthetic: boolean;
}

interface ListingsStoreValue {
  myListings: ManagedListing[];
  /** 給公開頁面（找房源列表、地圖、熱門物件）使用：已上架、未被刪除的房源。 */
  publishedListings: Listing[];
  pendingListings: PendingListing[];
  setPendingStatus: (id: string, status: ReviewStatus) => void;
  approvePendingListing: (id: string) => void;
  setPublishStatus: (id: string, status: PublishStatus) => void;
  trashListing: (id: string) => void;
  restoreListing: (id: string) => void;
  permanentlyDeleteListing: (id: string) => void;
  updateListing: (id: string, patch: Partial<Listing>) => void;
}

const AREA_CENTERS: Record<string, { lat: number; lng: number }> = {
  "台中市西屯區": { lat: 24.172, lng: 120.64 },
  "台中市北屯區": { lat: 24.183, lng: 120.7 },
  "台中市北區": { lat: 24.158, lng: 120.687 },
  "台中市西區": { lat: 24.148, lng: 120.665 },
  "台中市南屯區": { lat: 24.142, lng: 120.63 },
  "台中市大里區": { lat: 24.099, lng: 120.682 },
  "台中市太平區": { lat: 24.135, lng: 120.725 },
  "台中市南區": { lat: 24.118, lng: 120.655 },
};
const TAICHUNG_CENTER = { lat: 24.147, lng: 120.674 };

function pendingToListing(pending: PendingListing): ManagedListing {
  const center = AREA_CENTERS[pending.area] ?? TAICHUNG_CENTER;
  return {
    id: `new-${pending.id}`,
    title: pending.title,
    type: pending.type,
    propertyType: pending.propertyType,
    area: pending.area,
    displayAddress: pending.address,
    size: pending.size,
    layout: pending.layout,
    floor: pending.floor,
    age: pending.age,
    price: pending.price,
    inquiryCount: 0,
    images: pending.images,
    description: "由屋主／房東提交刊登，詳細資訊請洽仲介確認。",
    lat: center.lat,
    lng: center.lng,
    tags: [],
    agent: { name: "黃振嘉", phone: "0952-621-422" },
    publishStatus: "published",
    trashed: false,
    isSynthetic: true,
  };
}

const ListingsStoreContext = createContext<ListingsStoreValue | null>(null);

export function ListingsStoreProvider({ children }: { children: ReactNode }) {
  const [myListings, setMyListings] = useState<ManagedListing[]>(() =>
    [
      ...LISTINGS.map((l) => ({
        ...l,
        publishStatus: "published" as const,
        trashed: false,
        isSynthetic: false,
      })),
      // 種子資料裡本來就已經是「已通過」的待審核房源，一開始就該出現在我的房源。
      ...PENDING_LISTINGS.filter((l) => l.status === "approved").map(pendingToListing),
    ],
  );
  const [pendingListings, setPendingListings] = useState<PendingListing[]>(PENDING_LISTINGS);

  function setPendingStatus(id: string, status: ReviewStatus) {
    setPendingListings((prev) => prev.map((l) => (l.id === id ? { ...l, status } : l)));
  }

  function approvePendingListing(id: string) {
    setPendingListings((prev) =>
      prev.map((l) => (l.id === id ? { ...l, status: "approved" } : l)),
    );
    setMyListings((prev) => {
      if (prev.some((l) => l.id === `new-${id}`)) return prev;
      const pending = pendingListings.find((l) => l.id === id);
      if (!pending) return prev;
      return [pendingToListing(pending), ...prev];
    });
  }

  function setPublishStatus(id: string, status: PublishStatus) {
    setMyListings((prev) =>
      prev.map((l) => (l.id === id ? { ...l, publishStatus: status } : l)),
    );
  }

  function trashListing(id: string) {
    setMyListings((prev) => prev.map((l) => (l.id === id ? { ...l, trashed: true } : l)));
  }

  function restoreListing(id: string) {
    setMyListings((prev) => prev.map((l) => (l.id === id ? { ...l, trashed: false } : l)));
  }

  function permanentlyDeleteListing(id: string) {
    setMyListings((prev) => prev.filter((l) => l.id !== id));
  }

  function updateListing(id: string, patch: Partial<Listing>) {
    setMyListings((prev) => prev.map((l) => (l.id === id ? { ...l, ...patch } : l)));
  }

  const publishedListings = useMemo(
    () => myListings.filter((l) => l.publishStatus === "published" && !l.trashed),
    [myListings],
  );

  const value: ListingsStoreValue = {
    myListings,
    publishedListings,
    pendingListings,
    setPendingStatus,
    approvePendingListing,
    setPublishStatus,
    trashListing,
    restoreListing,
    permanentlyDeleteListing,
    updateListing,
  };

  return (
    <ListingsStoreContext.Provider value={value}>{children}</ListingsStoreContext.Provider>
  );
}

export function useListingsStore() {
  const ctx = useContext(ListingsStoreContext);
  if (!ctx) {
    throw new Error("useListingsStore must be used within a ListingsStoreProvider");
  }
  return ctx;
}
