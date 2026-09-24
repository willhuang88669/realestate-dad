"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import L from "leaflet";
import Link from "next/link";
import Image from "next/image";
import type { Listing } from "@/data/listings";
import { getDealByListingId } from "@/data/recentDeals";
import { formatPrice } from "@/lib/format";
import type { MapBounds } from "@/lib/filters";

const TAICHUNG_CENTER: [number, number] = [24.147, 120.674];

function priceIcon(listing: Listing, highlighted: boolean) {
  const deal = getDealByListingId(listing.id);
  const price = deal ? deal.price : listing.price;
  const color = deal ? "#171a21" : listing.type === "rent" ? "#0e9f6e" : "#2563eb";
  const short =
    listing.type === "rent" ? `${Math.round(price / 1000)}k` : `${price}萬`;

  return L.divIcon({
    className: "",
    html: `<div style="
        background:${color};
        color:#fff;
        font-weight:700;
        font-size:12px;
        padding:4px 8px;
        border-radius:999px;
        white-space:nowrap;
        box-shadow:0 2px 6px rgba(0,0,0,0.25);
        border:2px solid ${highlighted ? "#FFC53D" : "#fff"};
        transform:${highlighted ? "scale(1.15)" : "scale(1)"};
        transition: transform 150ms ease;
      ">${short}</div>`,
    iconSize: undefined,
    iconAnchor: [20, 14],
  });
}

function BoxSelectLayer({
  active,
  onSelect,
}: {
  active: boolean;
  onSelect: (bounds: MapBounds) => void;
}) {
  const map = useMap();
  const [rect, setRect] = useState<{ x: number; y: number; w: number; h: number } | null>(
    null,
  );
  const startPointRef = useRef<L.Point | null>(null);
  const startLatLngRef = useRef<L.LatLng | null>(null);

  useEffect(() => {
    if (!active) {
      map.dragging.enable();
      return;
    }
    map.dragging.disable();

    function onDown(e: L.LeafletMouseEvent) {
      startPointRef.current = e.containerPoint;
      startLatLngRef.current = e.latlng;
      setRect({ x: e.containerPoint.x, y: e.containerPoint.y, w: 0, h: 0 });
    }
    function onMove(e: L.LeafletMouseEvent) {
      if (!startPointRef.current) return;
      const sx = startPointRef.current.x;
      const sy = startPointRef.current.y;
      const cx = e.containerPoint.x;
      const cy = e.containerPoint.y;
      setRect({
        x: Math.min(sx, cx),
        y: Math.min(sy, cy),
        w: Math.abs(cx - sx),
        h: Math.abs(cy - sy),
      });
    }
    function onUp(e: L.LeafletMouseEvent) {
      if (startLatLngRef.current) {
        const bounds = L.latLngBounds(startLatLngRef.current, e.latlng);
        onSelect({
          south: bounds.getSouth(),
          west: bounds.getWest(),
          north: bounds.getNorth(),
          east: bounds.getEast(),
        });
      }
      startPointRef.current = null;
      startLatLngRef.current = null;
      setRect(null);
    }

    map.on("mousedown", onDown);
    map.on("mousemove", onMove);
    map.on("mouseup", onUp);
    return () => {
      map.off("mousedown", onDown);
      map.off("mousemove", onMove);
      map.off("mouseup", onUp);
      map.dragging.enable();
    };
  }, [active, map, onSelect]);

  if (!rect) return null;

  return createPortal(
    <div
      className="pointer-events-none absolute z-500 rounded-md border-2 border-navy bg-navy/10"
      style={{ left: rect.x, top: rect.y, width: rect.w, height: rect.h }}
    />,
    map.getContainer(),
  );
}

function ProgrammaticFlyTo({ listings }: { listings: Listing[] }) {
  const map = useMap();
  const listingsKey = listings.map((l) => l.id).join(",");

  useEffect(() => {
    if (listings.length === 0) return;
    const bounds = L.latLngBounds(listings.map((l) => [l.lat, l.lng]));
    map.fitBounds(bounds.pad(0.25), { animate: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listingsKey]);

  return null;
}

export default function ListingsMap({
  listings,
  boxSelectActive,
  onBoxSelect,
  highlightedId,
}: {
  listings: Listing[];
  boxSelectActive: boolean;
  onBoxSelect: (bounds: MapBounds) => void;
  highlightedId?: string | null;
}) {
  const handleSelect = useCallback(
    (bounds: MapBounds) => onBoxSelect(bounds),
    [onBoxSelect],
  );

  return (
    <MapContainer
      center={TAICHUNG_CENTER}
      zoom={12}
      scrollWheelZoom
      className="h-full w-full"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <ProgrammaticFlyTo listings={listings} />
      <BoxSelectLayer active={boxSelectActive} onSelect={handleSelect} />

      {listings.map((listing) => {
        const deal = getDealByListingId(listing.id);
        const closedLabel = listing.type === "rent" ? "已出租" : "已售出";
        return (
          <Marker
            key={listing.id}
            position={[listing.lat, listing.lng]}
            icon={priceIcon(listing, listing.id === highlightedId)}
          >
            <Popup minWidth={220}>
              <div className="flex flex-col gap-2">
                <div className="relative h-24 w-full overflow-hidden rounded-lg">
                  <Image
                    src={listing.images[0]}
                    alt={listing.title}
                    fill
                    sizes="220px"
                    className={`object-cover ${deal ? "grayscale-[30%]" : ""}`}
                  />
                  {deal && (
                    <span className="absolute left-1.5 top-1.5 rounded-full bg-ink/85 px-2 py-0.5 text-sm font-bold text-paper">
                      {closedLabel}
                    </span>
                  )}
                </div>
                <p className="line-clamp-1 text-sm font-bold text-ink">
                  {listing.title}
                </p>
                <p className="text-sm text-muted">{listing.displayAddress}</p>
                <p className="tabular-nums text-sm font-bold text-navy">
                  {deal
                    ? formatPrice({ type: listing.type, price: deal.price })
                    : formatPrice(listing)}
                </p>
                <Link
                  href={`/listings/${listing.id}`}
                  className="rounded-full bg-navy px-3 py-1.5 text-center text-sm font-bold text-navy-foreground"
                >
                  查看詳情
                </Link>
              </div>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
}
