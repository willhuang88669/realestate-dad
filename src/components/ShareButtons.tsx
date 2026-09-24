"use client";

import { useEffect, useState } from "react";
import { LinkIcon, CheckIcon, ShareIcon } from "@heroicons/react/24/outline";
import LineIcon from "@/components/LineIcon";

async function tryBuildImageFile(imageUrl: string | undefined): Promise<File | null> {
  if (!imageUrl) return null;
  try {
    const res = await fetch(imageUrl);
    const blob = await res.blob();
    return new File([blob], "listing.jpg", { type: blob.type || "image/jpeg" });
  } catch {
    // Cross-origin image without CORS headers (e.g. this prototype's stock photos) — share text/link instead.
    return null;
  }
}

function FacebookGlyph() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden="true">
      <path d="M13.5 21v-7.5h2.5l.4-3H13.5V8.4c0-.87.24-1.46 1.5-1.46h1.6V4.32C16.3 4.22 15.4 4 14.36 4 12.2 4 10.7 5.32 10.7 7.86V10.5H8.2v3h2.5V21h2.8z" />
    </svg>
  );
}

export default function ShareButtons({ title, imageUrl }: { title: string; imageUrl?: string }) {
  const [copied, setCopied] = useState(false);
  const [url, setUrl] = useState("");
  const [canNativeShare, setCanNativeShare] = useState(false);

  useEffect(() => {
    // Synced once on mount from the browser location/APIs, not derivable during SSR.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setUrl(window.location.href);
    setCanNativeShare(typeof navigator.share === "function");
  }, []);

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      // Clipboard API unavailable (e.g. insecure context) — fall back silently for this prototype.
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  async function nativeShare() {
    const imageFile = await tryBuildImageFile(imageUrl);
    try {
      if (imageFile && navigator.canShare?.({ files: [imageFile] })) {
        // With a photo attached, apps like Instagram offer "Add to Story" directly.
        await navigator.share({ title, files: [imageFile] });
      } else {
        await navigator.share({ title, url });
      }
    } catch {
      // User cancelled the share sheet, or the API is unavailable — no-op.
    }
  }

  const lineShareUrl = `https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(url)}`;
  const fbShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
  const threadsShareUrl = `https://www.threads.net/intent/post?text=${encodeURIComponent(`${title} ${url}`)}`;

  return (
    <div className="flex flex-wrap items-center gap-2">
      <button
        type="button"
        onClick={copyLink}
        className="inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-border bg-paper px-3.5 py-2 text-sm font-medium text-ink shadow-sm hover:bg-canvas"
      >
        {copied ? (
          <>
            <CheckIcon className="h-4 w-4 text-rent" aria-hidden="true" />
            已複製連結
          </>
        ) : (
          <>
            <LinkIcon className="h-4 w-4" aria-hidden="true" />
            複製連結
          </>
        )}
      </button>

      <a
        href={lineShareUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`分享「${title}」到 LINE`}
        className="inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-[#06C755] text-white shadow-sm hover:brightness-95"
      >
        <LineIcon />
      </a>

      <a
        href={fbShareUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`分享「${title}」到 Facebook`}
        className="inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-[#1877F2] text-white shadow-sm hover:brightness-95"
      >
        <FacebookGlyph />
      </a>

      <a
        href={threadsShareUrl}
        aria-label={`分享「${title}」到 Threads`}
        className="inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-black text-base font-bold text-white shadow-sm hover:brightness-125"
      >
        @
      </a>

      {canNativeShare && (
        <button
          type="button"
          onClick={nativeShare}
          aria-label={`分享「${title}」（例如 IG 限時動態）`}
          className="inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-border bg-paper px-3.5 py-2 text-sm font-medium text-ink shadow-sm hover:bg-canvas"
        >
          <ShareIcon className="h-4 w-4" aria-hidden="true" />
          更多分享
        </button>
      )}
    </div>
  );
}
