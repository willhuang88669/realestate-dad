"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import ThemeToggle from "@/components/ThemeToggle";
import LineIcon from "@/components/LineIcon";
import { LINE_CONTACT_URL, LINE_COMMUNITY_URL } from "@/config/line";
import { withBasePath } from "@/lib/basePath";

const NAV_LINKS = [
  { href: "/", label: "找房源" },
  { href: "/post", label: "刊登房源" },
  { href: "/admin", label: "後台管理" },
];

const LINE_LINKS = [
  { href: LINE_CONTACT_URL, label: "聯絡仲介" },
  { href: LINE_COMMUNITY_URL, label: "LINE社群" },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-paper/95 backdrop-blur supports-[backdrop-filter]:bg-paper/80">
      <div className="mx-auto grid h-16 max-w-7xl grid-cols-[auto_1fr_auto] items-center gap-4 px-4 sm:px-6">
        <Link
          href="/"
          className="flex shrink-0 items-center gap-2 whitespace-nowrap font-serif text-base font-medium tracking-wide text-ink sm:text-xl"
        >
          <Image
            src={withBasePath("/logo.png")}
            alt="群義房屋 | 黃振嘉"
            width={36}
            height={36}
            className="h-8 w-8 shrink-0 rounded-full sm:h-9 sm:w-9"
            priority
          />
          群義房屋 | 黃振嘉
        </Link>

        <nav className="hidden items-center justify-center gap-1 sm:flex">
          {NAV_LINKS.map((link) => {
            const active =
              link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                  active ? "bg-canvas text-ink" : "text-muted hover:bg-canvas hover:text-ink"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
          <span className="mx-1 h-4 w-px bg-border" aria-hidden="true" />
          {LINE_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium text-muted transition hover:bg-canvas hover:text-ink"
            >
              <LineIcon className="h-4 w-4 text-[#06C755]" />
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center justify-end gap-3">
          <Link
            href="/post"
            className="hidden shrink-0 items-center rounded-full border border-ink px-5 py-2.5 text-sm font-bold text-ink transition hover:bg-ink hover:text-paper cursor-pointer sm:inline-flex"
          >
            免費刊登
          </Link>

          <ThemeToggle />

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-label={open ? "關閉選單" : "開啟選單"}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full text-ink hover:bg-canvas cursor-pointer sm:hidden"
          >
            {open ? (
              <XMarkIcon className="h-6 w-6" aria-hidden="true" />
            ) : (
              <Bars3Icon className="h-6 w-6" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {open && (
        <nav className="flex flex-col gap-1 border-t border-border bg-paper px-4 py-3 sm:hidden">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="rounded-lg px-3 py-2.5 text-base font-medium text-ink hover:bg-canvas"
            >
              {link.label}
            </Link>
          ))}
          <div className="my-1 h-px bg-border" aria-hidden="true" />
          {LINE_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg px-3 py-2.5 text-base font-medium text-ink hover:bg-canvas"
            >
              <LineIcon className="h-4 w-4 text-[#06C755]" />
              {link.label}
            </a>
          ))}
        </nav>
      )}
    </header>
  );
}
