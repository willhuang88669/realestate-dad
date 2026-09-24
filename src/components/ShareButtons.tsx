"use client";

import { useEffect, useState } from "react";
import { LinkIcon, CheckIcon } from "@heroicons/react/24/outline";
import LineIcon from "@/components/LineIcon";

function FacebookGlyph() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden="true">
      <path d="M13.5 21v-7.5h2.5l.4-3H13.5V8.4c0-.87.24-1.46 1.5-1.46h1.6V4.32C16.3 4.22 15.4 4 14.36 4 12.2 4 10.7 5.32 10.7 7.86V10.5H8.2v3h2.5V21h2.8z" />
    </svg>
  );
}

export default function ShareButtons({ title }: { title: string }) {
  const [copied, setCopied] = useState(false);
  const [url, setUrl] = useState("");

  useEffect(() => {
    // Synced once on mount from the browser location, not derivable during SSR.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setUrl(window.location.href);
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

  const lineShareUrl = `https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(url)}`;
  const fbShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;

  return (
    <div className="flex items-center gap-2">
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
    </div>
  );
}
