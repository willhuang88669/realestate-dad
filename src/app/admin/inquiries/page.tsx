"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { INQUIRIES, type Inquiry, type InquiryStatus } from "@/data/inquiries";
import { getListingById, type ListingType } from "@/data/listings";
import { typeLabel, telHref } from "@/lib/format";
import AdminNav from "@/components/AdminNav";
import PillFilter from "@/components/PillFilter";

const STATUS_OPTIONS: InquiryStatus[] = ["已聯絡", "已約看", "已成交"];

const STATUS_CLASS: Record<InquiryStatus, string> = {
  已聯絡: "bg-sale text-sale-foreground",
  已約看: "bg-progress text-progress-foreground",
  已成交: "bg-rent text-rent-foreground",
};

type TypeFilter = "all" | ListingType;
type StatusFilter = "all" | InquiryStatus;

export default function AdminInquiriesPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>(INQUIRIES);
  const [typeFilter, setTypeFilter] = useState<TypeFilter>("all");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [drafts, setDrafts] = useState<Record<string, string>>(() =>
    Object.fromEntries(INQUIRIES.map((q) => [q.id, q.reply ?? ""])),
  );

  function setStatus(id: string, status: InquiryStatus) {
    setInquiries((prev) => prev.map((q) => (q.id === id ? { ...q, status } : q)));
  }

  function saveReply(id: string) {
    setInquiries((prev) =>
      prev.map((q) => (q.id === id ? { ...q, reply: drafts[id]?.trim() || undefined } : q)),
    );
  }

  const filteredInquiries = useMemo(
    () =>
      inquiries.filter((q) => {
        const listingType = getListingById(q.listingId)?.type;
        return (
          (typeFilter === "all" || listingType === typeFilter) &&
          (statusFilter === "all" || q.status === statusFilter)
        );
      }),
    [inquiries, typeFilter, statusFilter],
  );

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-4 px-4 py-6 sm:px-6 sm:py-8">
      <h1 className="text-2xl font-black tracking-tight text-ink sm:text-3xl">
        後台管理
      </h1>

      <AdminNav />

      <div className="flex flex-col gap-2 rounded-2xl border border-border bg-paper p-4">
        <PillFilter
          label="類型"
          value={typeFilter}
          onChange={setTypeFilter}
          options={[
            { value: "all", label: "全部" },
            { value: "sale", label: "售" },
            { value: "rent", label: "租" },
          ]}
        />
        <PillFilter
          label="狀態"
          value={statusFilter}
          onChange={setStatusFilter}
          options={[
            { value: "all", label: "全部" },
            { value: "已聯絡", label: "已聯絡" },
            { value: "已約看", label: "已約看" },
            { value: "已成交", label: "已成交" },
          ]}
        />
      </div>

      <p className="text-sm text-muted">
        顯示 {filteredInquiries.length} 筆（共 {inquiries.length} 筆詢問紀錄）
      </p>

      <div className="flex flex-col gap-3">
        {filteredInquiries.length === 0 && (
          <p className="rounded-2xl border border-dashed border-border bg-paper py-10 text-center text-sm text-muted">
            沒有符合篩選條件的詢問紀錄
          </p>
        )}
        {filteredInquiries.map((inquiry) => {
          const listing = getListingById(inquiry.listingId);
          return (
            <div
              key={inquiry.id}
              className="flex flex-col gap-2 rounded-2xl border border-border bg-paper p-4"
            >
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div className="min-w-0">
                  <div className="mb-1 flex items-center gap-2">
                    {listing && (
                      <span
                        className={`rounded-full px-2 py-0.5 text-sm font-bold ${
                          listing.type === "rent"
                            ? "bg-rent text-rent-foreground"
                            : "bg-sale text-sale-foreground"
                        }`}
                      >
                        {typeLabel(listing.type)}
                      </span>
                    )}
                    <Link
                      href={`/listings/${inquiry.listingId}`}
                      className="text-sm font-bold text-ink hover:underline"
                    >
                      {inquiry.listingTitle}
                    </Link>
                  </div>
                  <p className="tabular-nums text-sm text-muted">{inquiry.submittedAt}</p>
                </div>

                <label className="flex items-center gap-2">
                  <span className="sr-only">詢問狀態</span>
                  <select
                    value={inquiry.status}
                    onChange={(e) => setStatus(inquiry.id, e.target.value as InquiryStatus)}
                    className={`cursor-pointer rounded-full border-0 px-3 py-1.5 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-navy ${STATUS_CLASS[inquiry.status]}`}
                  >
                    {STATUS_OPTIONS.map((opt) => (
                      <option key={opt} value={opt} className="bg-paper text-ink">
                        {opt}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-ink">
                <span className="font-bold">{inquiry.name}</span>
                <a
                  href={telHref(inquiry.phone)}
                  className="tabular-nums text-navy underline-offset-2 hover:underline"
                >
                  {inquiry.phone}
                </a>
              </div>
              <p className="text-sm text-ink/80">{inquiry.message}</p>

              <div className="mt-2 flex flex-col gap-2 border-t border-border pt-3">
                <div className="flex items-center justify-between">
                  <label htmlFor={`reply-${inquiry.id}`} className="text-sm font-bold text-ink">
                    我的回覆（會公開顯示在房源頁面）
                  </label>
                  <span
                    className={`rounded-full px-2 py-0.5 text-sm font-bold ${
                      inquiry.reply
                        ? "bg-rent text-rent-foreground"
                        : "bg-canvas text-muted"
                    }`}
                  >
                    {inquiry.reply ? "已回覆" : "尚未回覆"}
                  </span>
                </div>
                <textarea
                  id={`reply-${inquiry.id}`}
                  rows={2}
                  value={drafts[inquiry.id] ?? ""}
                  onChange={(e) =>
                    setDrafts((prev) => ({ ...prev, [inquiry.id]: e.target.value }))
                  }
                  placeholder="輸入針對這則詢問的回覆…"
                  className="resize-none rounded-lg border border-border bg-canvas px-3 py-2 text-sm text-ink placeholder:text-muted/70 focus:border-navy focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => saveReply(inquiry.id)}
                  disabled={(drafts[inquiry.id] ?? "") === (inquiry.reply ?? "")}
                  className="w-fit cursor-pointer rounded-full bg-navy px-4 py-1.5 text-sm font-bold text-navy-foreground transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  儲存回覆
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
