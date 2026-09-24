import Image from "next/image";
import Link from "next/link";
import { CheckCircleIcon } from "@heroicons/react/24/solid";
import { getListingById } from "@/data/listings";
import type { RecentDeal } from "@/data/recentDeals";
import { formatPrice, typeLabel } from "@/lib/format";

export default function RecentDealCard({ deal }: { deal: RecentDeal }) {
  const listing = getListingById(deal.listingId);
  if (!listing) return null;

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
          className="object-cover grayscale-[30%] transition duration-300 group-hover:scale-105"
        />
        <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-ink/85 px-2.5 py-1 text-sm font-bold text-paper">
          <CheckCircleIcon className="h-3.5 w-3.5" aria-hidden="true" />
          已成交
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-1.5 p-4">
        <h3 className="line-clamp-1 text-sm font-bold text-ink">{listing.title}</h3>
        <p className="line-clamp-1 text-sm text-muted">{listing.area}</p>
        <p className="text-sm text-muted">
          {listing.size} 坪・{listing.layout}
        </p>
        <div className="mt-auto flex items-center justify-between pt-2">
          <span className="tabular-nums text-base font-bold text-navy">
            {formatPrice({ type: listing.type, price: deal.price })}
          </span>
          <span className="text-sm text-muted">
            {typeLabel(listing.type)}出・{deal.closedAt}
          </span>
        </div>
      </div>
    </Link>
  );
}
