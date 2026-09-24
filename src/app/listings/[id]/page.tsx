import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeftIcon, CheckCircleIcon } from "@heroicons/react/24/outline";
import { LISTINGS, getListingById, type Listing } from "@/data/listings";
import { getDealByListingId, type RecentDeal } from "@/data/recentDeals";
import { formatPrice, formatUnitPrice, typeLabel, telHref } from "@/lib/format";
import { getListingQA } from "@/lib/qa";
import ImageCarousel from "@/components/ImageCarousel";
import InquiryModal from "@/components/InquiryModal";
import ShareButtons from "@/components/ShareButtons";

export function generateStaticParams() {
  return LISTINGS.map((l) => ({ id: l.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const listing = getListingById(id);
  if (!listing) return {};

  const deal = getDealByListingId(listing.id);
  const closedVerb = listing.type === "rent" ? "出租" : "售出";
  const priceText = deal
    ? `成交價 ${formatPrice({ type: listing.type, price: deal.price })}`
    : formatPrice(listing);
  const ogTitle = `${listing.title}｜${priceText}`;
  const description = `${listing.area}・${listing.displayAddress}・${listing.size} 坪・${listing.layout}${
    deal ? `・已${closedVerb}` : ""
  }`;

  return {
    title: listing.title,
    description,
    openGraph: {
      title: ogTitle,
      description,
      type: "website",
      images: [{ url: listing.images[0], width: 1200, height: 800, alt: listing.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description,
      images: [listing.images[0]],
    },
  };
}

const DETAIL_ROWS: { key: "size" | "layout" | "floor" | "age"; label: string }[] = [
  { key: "size", label: "坪數" },
  { key: "layout", label: "格局" },
  { key: "floor", label: "樓層" },
  { key: "age", label: "屋齡" },
];

export default async function ListingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const listing = getListingById(id);
  if (!listing) notFound();

  const deal = getDealByListingId(listing.id);
  const closedLabel = listing.type === "rent" ? "已出租" : "已售出";
  const questions = getListingQA(listing);
  const similarListings = getSimilarListings(listing);

  const badgeClass = deal
    ? "bg-ink text-paper"
    : listing.type === "rent"
      ? "bg-rent text-rent-foreground"
      : "bg-sale text-sale-foreground";

  return (
    <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 sm:py-8">
      <Link
        href="/"
        className="mb-4 inline-flex items-center gap-1 text-sm font-medium text-muted hover:text-ink"
      >
        <ChevronLeftIcon className="h-4 w-4" aria-hidden="true" />
        返回房源列表
      </Link>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
        <div className="flex flex-col gap-6">
          <ImageCarousel images={listing.images} alt={listing.title} />

          <div className="flex flex-col gap-6 lg:hidden">
            <PriceAndActions listing={listing} deal={deal} badgeClass={badgeClass} />
            <SimilarListings listings={similarListings} />
          </div>

          <div>
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <span
                className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-sm font-bold ${badgeClass}`}
              >
                {deal && <CheckCircleIcon className="h-3.5 w-3.5" aria-hidden="true" />}
                {deal ? closedLabel : typeLabel(listing.type)}
              </span>
              <span className="text-sm text-muted">{listing.propertyType}</span>
            </div>
            <h1 className="font-serif text-2xl font-medium tracking-tight text-ink sm:text-3xl">
              {listing.title}
            </h1>
            <p className="mt-1 text-sm text-muted">{listing.displayAddress}</p>
          </div>

          <div className="grid grid-cols-2 gap-3 rounded-2xl border border-border bg-paper p-4 sm:grid-cols-4">
            {DETAIL_ROWS.map((row) => (
              <div key={row.key} className="flex flex-col gap-0.5">
                <span className="text-sm text-muted">{row.label}</span>
                <span className="tabular-nums text-sm font-bold text-ink">
                  {row.key === "size" && `${listing.size} 坪`}
                  {row.key === "layout" && listing.layout}
                  {row.key === "floor" && listing.floor}
                  {row.key === "age" && `${listing.age} 年`}
                </span>
              </div>
            ))}
          </div>

          {listing.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {listing.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-border bg-canvas px-3 py-1 text-sm text-muted"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          <div>
            <h2 className="mb-2 text-base font-bold text-ink">房屋描述</h2>
            <p className="whitespace-pre-line text-sm leading-relaxed text-ink/80">
              {listing.description}
            </p>
          </div>

          {questions.length > 0 && (
            <div>
              <h2 className="mb-3 text-base font-bold text-ink">
                訪客提問<span className="ml-1 text-sm font-normal text-muted">（{questions.length}）</span>
              </h2>
              <div className="flex flex-col gap-3">
                {questions.map((q) => (
                  <div
                    key={q.id}
                    className="flex flex-col gap-2 rounded-2xl border border-border bg-paper p-4"
                  >
                    <div className="flex items-center gap-3">
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-canvas text-sm font-bold text-muted">
                        Q
                      </span>
                      <p className="text-sm text-ink">{q.message}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-navy text-sm font-bold text-navy-foreground">
                        A
                      </span>
                      <p className="text-sm text-ink/80">{q.reply}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <aside className="hidden flex-col lg:flex">
          <div className="sticky top-24 flex flex-col gap-6">
            <PriceAndActions listing={listing} deal={deal} badgeClass={badgeClass} />
            <SimilarListings listings={similarListings} />
          </div>
        </aside>
      </div>
    </div>
  );
}

function SimilarListings({ listings }: { listings: Listing[] }) {
  if (listings.length === 0) return null;
  return (
    <div className="flex flex-col gap-3">
      <h2 className="text-base font-bold text-ink">查看相似物件</h2>
      <div className="flex flex-col gap-2">
        {listings.map((l) => (
          <SimilarListingRow key={l.id} listing={l} />
        ))}
      </div>
    </div>
  );
}

function SimilarListingRow({ listing }: { listing: Listing }) {
  return (
    <Link
      href={`/listings/${listing.id}`}
      className="group flex items-center gap-3 rounded-2xl border border-border bg-paper p-2 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
    >
      <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-canvas">
        <Image
          src={listing.images[0]}
          alt={listing.title}
          fill
          sizes="64px"
          className="object-cover transition duration-300 group-hover:scale-105"
        />
      </div>
      <div className="min-w-0 flex-1">
        <h3 className="line-clamp-1 text-sm font-bold text-ink">{listing.title}</h3>
        <p className="line-clamp-1 text-sm text-muted">{listing.area}</p>
        <p className="tabular-nums text-sm font-bold text-navy">{formatPrice(listing)}</p>
      </div>
    </Link>
  );
}

function getSimilarListings(listing: Listing): Listing[] {
  const candidates = LISTINGS.filter(
    (l) => l.id !== listing.id && l.type === listing.type && !getDealByListingId(l.id),
  );

  const scored = candidates
    .map((l) => ({
      listing: l,
      score:
        (l.area === listing.area ? 2 : 0) + (l.propertyType === listing.propertyType ? 1 : 0),
    }))
    .sort((a, b) => b.score - a.score);

  return scored.slice(0, 4).map((s) => s.listing);
}

function PriceAndActions({
  listing,
  deal,
  badgeClass,
}: {
  listing: NonNullable<ReturnType<typeof getListingById>>;
  deal: RecentDeal | undefined;
  badgeClass: string;
}) {
  const closedLabel = listing.type === "rent" ? "已出租" : "已售出";

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-border bg-paper p-5 shadow-sm">
      <div>
        <div className="mb-1 flex items-center gap-2">
          <span className={`rounded-full px-2 py-0.5 text-sm font-bold ${badgeClass}`}>
            {deal ? closedLabel : typeLabel(listing.type)}
          </span>
        </div>

        {deal ? (
          <>
            <p className="text-sm text-muted">成交價</p>
            <p className="tabular-nums text-3xl font-black text-navy">
              {formatPrice({ type: listing.type, price: deal.price })}
            </p>
            <p className="tabular-nums text-sm text-muted">
              成交日期：{deal.closedAt}・原開價 {formatPrice(listing)}
            </p>
          </>
        ) : (
          <>
            <p className="tabular-nums text-3xl font-black text-navy">
              {formatPrice(listing)}
            </p>
            <p className="tabular-nums text-sm text-muted">{formatUnitPrice(listing)}</p>
          </>
        )}
      </div>

      {deal ? (
        <div className="rounded-full border border-border bg-canvas py-3 text-center text-sm font-bold text-muted">
          此物件已{closedLabel === "已出租" ? "出租" : "售出"}，無法詢問
        </div>
      ) : (
        <InquiryModal listingTitle={listing.title} inquiryCount={listing.inquiryCount} />
      )}

      <div className="flex flex-col gap-2 border-t border-border pt-4">
        <span className="text-sm text-muted">分享這個物件</span>
        <ShareButtons title={listing.title} />
      </div>

      <div className="flex items-center gap-3 border-t border-border pt-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-canvas text-sm font-bold text-ink">
          {listing.agent.name.slice(0, 1)}
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-bold text-ink">{listing.agent.name}</p>
          <a
            href={telHref(listing.agent.phone)}
            className="tabular-nums text-sm text-navy underline-offset-2 hover:underline"
          >
            {listing.agent.phone}
          </a>
        </div>
      </div>
    </div>
  );
}
