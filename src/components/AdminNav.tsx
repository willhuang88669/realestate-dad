"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  { href: "/admin/listings", label: "我的房源" },
  { href: "/admin", label: "待審核房源" },
  { href: "/admin/inquiries", label: "詢問紀錄" },
];

export default function AdminNav() {
  const pathname = usePathname();

  return (
    <div className="inline-flex w-fit rounded-full border border-border bg-paper p-1 shadow-sm">
      {TABS.map((tab) => {
        const active = pathname === tab.href;
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={`rounded-full px-5 py-2 text-sm font-bold transition ${
              active ? "bg-navy text-navy-foreground" : "text-muted hover:text-ink"
            }`}
          >
            {tab.label}
          </Link>
        );
      })}
    </div>
  );
}
