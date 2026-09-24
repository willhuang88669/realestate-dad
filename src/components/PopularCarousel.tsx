"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Listing } from "@/data/listings";
import { formatPrice, typeLabel } from "@/lib/format";

const SWIPE_THRESHOLD = 40;

export default function PopularCarousel({ listings }: { listings: Listing[] }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const dragStartX = useRef<number | null>(null);
  const dragDistance = useRef(0);

  useEffect(() => {
    if (listings.length <= 1 || paused) return;
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % listings.length);
    }, 5000);
    return () => clearInterval(id);
  }, [listings.length, paused]);

  if (listings.length === 0) return null;

  function go(delta: number) {
    setIndex((i) => (i + delta + listings.length) % listings.length);
  }

  function handlePointerDown(e: React.PointerEvent) {
    dragStartX.current = e.clientX;
    dragDistance.current = 0;
    setPaused(true);
  }

  function handlePointerMove(e: React.PointerEvent) {
    if (dragStartX.current === null) return;
    dragDistance.current = e.clientX - dragStartX.current;
  }

  function handlePointerUp() {
    if (dragStartX.current !== null) {
      if (dragDistance.current <= -SWIPE_THRESHOLD) {
        go(1);
      } else if (dragDistance.current >= SWIPE_THRESHOLD) {
        go(-1);
      }
    }
    dragStartX.current = null;
    setPaused(false);
  }

  function handleClickCapture(e: React.MouseEvent) {
    if (Math.abs(dragDistance.current) > SWIPE_THRESHOLD) {
      e.preventDefault();
    }
    dragDistance.current = 0;
  }

  return (
    <section
      className="mx-auto flex max-w-7xl flex-col gap-4 px-4 pt-6 sm:px-6 sm:pt-8"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <h2 className="font-serif text-3xl font-medium leading-tight tracking-tight text-ink sm:text-5xl">
        熱門<span className="text-navy">物件</span>・詢問度最高
      </h2>

      <div
        className="relative aspect-[4/3] w-full cursor-grab touch-pan-y select-none overflow-hidden rounded-3xl active:cursor-grabbing sm:aspect-[16/9]"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={() => {
          dragStartX.current = null;
          setPaused(false);
        }}
        onClickCapture={handleClickCapture}
      >
        {listings.map((listing, i) => (
          <Link
            key={listing.id}
            href={`/listings/${listing.id}`}
            aria-hidden={i !== index}
            tabIndex={i === index ? 0 : -1}
            draggable={false}
            className={`group absolute inset-0 transition-opacity duration-700 ${
              i === index ? "z-10 opacity-100" : "pointer-events-none opacity-0"
            }`}
          >
            <Image
              src={listing.images[0]}
              alt={listing.title}
              fill
              sizes="(min-width: 1280px) 1280px, 100vw"
              className="pointer-events-none object-cover transition duration-300 group-hover:scale-105"
              priority={i === 0}
              draggable={false}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />

            <div className="absolute inset-x-0 bottom-0 flex flex-col items-start gap-3 p-5 sm:p-8">
              <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-yellow px-3 py-1 text-sm font-bold text-yellow-foreground">
                {typeLabel(listing.type)}・{listing.inquiryCount} 人詢問中
              </span>
              <h3 className="max-w-lg font-serif text-xl font-medium text-white sm:text-3xl">
                {listing.title}
              </h3>
              <p className="tabular-nums text-lg font-bold text-navy sm:text-2xl">
                {formatPrice(listing)}
              </p>
              <span className="inline-flex w-fit items-center rounded-full bg-white px-5 py-2.5 text-sm font-bold text-black transition group-hover:bg-navy group-hover:text-navy-foreground">
                查看詳情
              </span>
            </div>
          </Link>
        ))}
      </div>

      {listings.length > 1 && (
        <div className="flex justify-center gap-1.5">
          {listings.map((listing, i) => (
            <button
              key={listing.id}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`前往第 ${i + 1} 筆`}
              className={`h-1.5 cursor-pointer rounded-full transition-all ${
                i === index ? "w-6 bg-navy" : "w-1.5 bg-border"
              }`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
