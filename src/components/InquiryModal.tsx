"use client";

import { useEffect, useState } from "react";
import { XMarkIcon, CheckCircleIcon, ChatBubbleLeftEllipsisIcon } from "@heroicons/react/24/outline";

export default function InquiryModal({
  listingTitle,
  inquiryCount,
}: {
  listingTitle: string;
  inquiryCount: number;
}) {
  const [open, setOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [count, setCount] = useState(inquiryCount);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [lineId, setLineId] = useState("");
  const [message, setMessage] = useState(`您好，我對「${listingTitle}」有興趣，想了解更多資訊。`);

  useEffect(() => {
    if (!open) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") close();
    }
    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [open]);

  function close() {
    setOpen(false);
    setTimeout(() => setSubmitted(false), 200);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
    setCount((c) => c + 1);
  }

  return (
    <div className="flex flex-col gap-2">
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="w-full cursor-pointer rounded-full bg-yellow py-3 text-center text-base font-bold text-yellow-foreground shadow-sm transition hover:brightness-95"
      >
        立即詢問
      </button>
      <p className="flex items-center justify-center gap-1 text-sm text-muted">
        <ChatBubbleLeftEllipsisIcon className="h-3.5 w-3.5" aria-hidden="true" />
        已有 <span className="tabular-nums font-bold text-ink">{count}</span> 人詢問過
      </p>

      {open && (
        <div
          className="fixed inset-0 z-1000 flex items-end justify-center sm:items-center"
          role="dialog"
          aria-modal="true"
          aria-label="立即詢問表單"
        >
          <div className="absolute inset-0 bg-black/40" onClick={close} />

          <div className="relative flex max-h-[85vh] w-full max-w-md flex-col gap-4 overflow-y-auto rounded-t-2xl bg-paper p-5 shadow-2xl sm:rounded-2xl">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-ink">
                {submitted ? "詢問已送出" : "立即詢問"}
              </h2>
              <button
                type="button"
                onClick={close}
                aria-label="關閉"
                className="cursor-pointer rounded-full p-1.5 hover:bg-canvas"
              >
                <XMarkIcon className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>

            {submitted ? (
              <div className="flex flex-col items-center gap-3 py-6 text-center">
                <CheckCircleIcon className="h-14 w-14 text-rent" aria-hidden="true" />
                <p className="text-base font-bold text-ink">已送出！</p>
                <p className="text-sm text-muted">
                  仲介收到您的詢問後會盡快與您聯繫。
                </p>
                <button
                  type="button"
                  onClick={close}
                  className="mt-2 cursor-pointer rounded-full bg-navy px-6 py-2.5 text-sm font-bold text-navy-foreground"
                >
                  關閉
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                <p className="text-sm text-muted">
                  針對「{listingTitle}」留下您的聯絡方式，仲介會盡快與您聯繫。
                </p>

                <label className="flex flex-col gap-1 text-sm font-medium text-ink">
                  姓名 <span className="text-danger">*</span>
                  <input
                    required
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="請輸入您的姓名"
                    className="rounded-lg border border-border px-3 py-2.5 text-sm focus:border-navy focus:outline-none"
                  />
                </label>

                <label className="flex flex-col gap-1 text-sm font-medium text-ink">
                  聯絡電話 <span className="text-danger">*</span>
                  <input
                    required
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="請輸入手機號碼"
                    className="rounded-lg border border-border px-3 py-2.5 text-sm focus:border-navy focus:outline-none"
                  />
                </label>

                <label className="flex flex-col gap-1 text-sm font-medium text-ink">
                  LINE ID
                  <input
                    type="text"
                    value={lineId}
                    onChange={(e) => setLineId(e.target.value)}
                    placeholder="選填，方便仲介用 LINE 聯繫"
                    className="rounded-lg border border-border px-3 py-2.5 text-sm focus:border-navy focus:outline-none"
                  />
                </label>

                <label className="flex flex-col gap-1 text-sm font-medium text-ink">
                  留言
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={2}
                    className="resize-none rounded-lg border border-border px-3 py-2.5 text-sm focus:border-navy focus:outline-none"
                  />
                </label>

                <button
                  type="submit"
                  className="mt-1 w-full cursor-pointer rounded-full bg-yellow py-3 text-sm font-bold text-yellow-foreground transition hover:brightness-95"
                >
                  送出詢問
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
