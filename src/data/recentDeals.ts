export interface RecentDeal {
  id: string;
  /** 對應 LISTINGS 裡的房源 id，成交後仍可點進去看原始物件資訊 */
  listingId: string;
  /** 成交價：售屋萬元；租屋元/月（可能與原始開價不同） */
  price: number;
  closedAt: string;
}

export const RECENT_DEALS: RecentDeal[] = [
  { id: "d1", listingId: "1", price: 2600, closedAt: "2026-09-20" },
  { id: "d2", listingId: "3", price: 1520, closedAt: "2026-09-15" },
  { id: "d3", listingId: "5", price: 2900, closedAt: "2026-09-08" },
  { id: "d4", listingId: "2", price: 37000, closedAt: "2026-09-18" },
  { id: "d5", listingId: "4", price: 15500, closedAt: "2026-09-12" },
  { id: "d6", listingId: "6", price: 25000, closedAt: "2026-09-05" },
];

export function getDealByListingId(listingId: string): RecentDeal | undefined {
  return RECENT_DEALS.find((d) => d.listingId === listingId);
}
