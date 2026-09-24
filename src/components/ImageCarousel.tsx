"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";

export default function ImageCarousel({
  images,
  alt,
}: {
  images: string[];
  alt: string;
}) {
  const [index, setIndex] = useState(0);

  function prev() {
    setIndex((i) => (i - 1 + images.length) % images.length);
  }
  function next() {
    setIndex((i) => (i + 1) % images.length);
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-canvas sm:aspect-[16/9]">
        <Image
          key={images[index]}
          src={images[index]}
          alt={`${alt} - 照片 ${index + 1}`}
          fill
          priority={index === 0}
          sizes="(min-width: 1024px) 800px, 100vw"
          className="object-cover"
        />

        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={prev}
              aria-label="上一張照片"
              className="absolute left-3 top-1/2 -translate-y-1/2 cursor-pointer rounded-full bg-paper/90 p-2 shadow-md hover:bg-paper"
            >
              <ChevronLeftIcon className="h-5 w-5 text-ink" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={next}
              aria-label="下一張照片"
              className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer rounded-full bg-paper/90 p-2 shadow-md hover:bg-paper"
            >
              <ChevronRightIcon className="h-5 w-5 text-ink" aria-hidden="true" />
            </button>
            <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
              {images.map((img, i) => (
                <button
                  key={img}
                  type="button"
                  aria-label={`前往照片 ${i + 1}`}
                  onClick={() => setIndex(i)}
                  className={`h-1.5 cursor-pointer rounded-full transition-all ${
                    i === index ? "w-5 bg-paper" : "w-1.5 bg-paper/60"
                  }`}
                />
              ))}
            </div>
            <span className="absolute right-3 bottom-3 rounded-full bg-black/60 px-2.5 py-1 text-sm font-medium text-white">
              {index + 1} / {images.length}
            </span>
          </>
        )}
      </div>

      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {images.map((img, i) => (
            <button
              key={img}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`前往照片 ${i + 1}`}
              className={`relative h-16 w-20 shrink-0 overflow-hidden rounded-lg border-2 transition ${
                i === index ? "border-navy" : "border-transparent opacity-70 hover:opacity-100"
              }`}
            >
              <Image src={img} alt="" fill sizes="80px" className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
