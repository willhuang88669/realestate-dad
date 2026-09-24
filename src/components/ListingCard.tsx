import Image from "next/image";
import Link from "next/link";
import { ChatBubbleLeftEllipsisIcon } from "@heroicons/react/24/outline";
import type { Listing } from "@/data/listings";
import { getDealByListingId } from "@/data/recentDeals";
import { formatPrice, typeLabel } from "@/lib/format";

export default function ListingCard({ listing }: { listing: Listing }) {
  const deal = getDealByListingId(listing.id);
  const closedLabel = listing.type === "rent" ? "已出租" : "已售出";

  const badgeClass = deal
    ? "bg-ink text-paper"
    : listing.type === "rent"
      ? "bg-rent text-rent-foreground"
      : "bg-sale text-sale-foreground";

  return (
    <Link
      href={`/listings/${listing.id}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-paper shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-canvas">
        <Image
          src={listing.images[0]}
          alt={listing.title}
          fill
          sizes="(min-width: 1024px) 320px, (min-width: 640px) 45vw, 90vw"
          className={`object-cover transition duration-300 group-hover:scale-105 ${deal ? "grayscale-[30%]" : ""}`}
        />
        <span
          className={`absolute left-3 top-3 rounded-full px-2.5 py-1 text-sm font-bold ${badgeClass}`}
        >
          {deal ? closedLabel : typeLabel(listing.type)}
        </span>
        {!deal && (
          <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-navy px-2.5 py-1 text-sm font-bold text-navy-foreground shadow-sm">
            <ChatBubbleLeftEllipsisIcon className="h-3.5 w-3.5" aria-hidden="true" />
            {listing.inquiryCount} 人已詢問
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="line-clamp-1 text-base font-bold text-ink">
            {listing.title}
          </h3>
        </div>
        <p className="line-clamp-1 text-sm text-muted">
          {listing.displayAddress}
        </p>

        <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-sm text-muted">
          <span>{listing.size} 坪</span>
          <span className="text-border">・</span>
          <span>{listing.layout}</span>
          <span className="text-border">・</span>
          <span>{listing.floor}</span>
          <span className="text-border">・</span>
          <span>屋齡 {listing.age} 年</span>
        </div>

        <div className="mt-auto flex items-center justify-between pt-2">
          <span className="tabular-nums text-lg font-bold text-navy">
            {deal ? formatPrice({ type: listing.type, price: deal.price }) : formatPrice(listing)}
          </span>
          <span className="text-sm text-muted">
            {deal ? `成交價・${listing.propertyType}` : listing.propertyType}
          </span>
        </div>
      </div>
    </Link>
  );
}
