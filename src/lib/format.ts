import type { Listing } from "@/data/listings";

export function formatPrice(listing: Pick<Listing, "type" | "price">) {
  if (listing.type === "rent") {
    return `${listing.price.toLocaleString("zh-TW")} 元/月`;
  }
  return `${listing.price.toLocaleString("zh-TW")} 萬`;
}

export function formatUnitPrice(listing: Pick<Listing, "type" | "price" | "size">) {
  if (listing.type === "sale") {
    const perPing = listing.price / listing.size;
    return `單價 ${perPing.toFixed(1)} 萬/坪`;
  }
  const perPing = listing.price / listing.size;
  return `單價 ${Math.round(perPing).toLocaleString("zh-TW")} 元/坪`;
}

export function typeLabel(type: Listing["type"]) {
  return type === "rent" ? "租" : "售";
}

export function telHref(phone: string) {
  return `tel:${phone.replace(/[^\d+]/g, "")}`;
}
