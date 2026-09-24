"use client";

import { useEffect, useState } from "react";
import { LinkIcon, CheckIcon, ShareIcon } from "@heroicons/react/24/outline";
import LineIcon from "@/components/LineIcon";

export default function ShareButtons({ title }: { title: string }) {
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
    try {
      await navigator.share({ title, url });
    } catch {
      // User cancelled the share sheet, or the API is unavailable — no-op.
    }
  }

  const lineShareUrl = `https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(url)}`;

  return (
    <div className="flex flex-wrap items-center gap-2">
      <a
        href={lineShareUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`分享「${title}」到 LINE`}
        className="inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-[#06C755] text-white shadow-sm hover:brightness-95"
      >
        <LineIcon />
      </a>

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
