"use client";

import { useEffect } from "react";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";

export default function ConfirmDialog({
  title,
  message,
  confirmLabel = "確定",
  cancelLabel = "取消",
  onConfirm,
  onCancel,
}: {
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onCancel();
    }
    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [onCancel]);

  return (
    <div
      className="fixed inset-0 z-1000 flex items-end justify-center sm:items-center"
      role="alertdialog"
      aria-modal="true"
      aria-label={title}
    >
      <div className="absolute inset-0 bg-black/40" onClick={onCancel} />

      <div className="relative flex max-h-[80vh] w-full max-w-sm flex-col gap-4 overflow-y-auto rounded-t-2xl bg-paper p-5 shadow-2xl sm:rounded-2xl">
        <div className="flex items-start gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-danger/10 text-danger">
            <ExclamationTriangleIcon className="h-5 w-5" aria-hidden="true" />
          </span>
          <div className="min-w-0">
            <h2 className="text-base font-bold text-ink">{title}</h2>
            <p className="mt-1 text-sm text-muted">{message}</p>
          </div>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onCancel}
            className="order-2 cursor-pointer rounded-full border border-border px-4 py-2.5 text-sm font-bold text-ink hover:bg-canvas sm:order-1"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="order-1 cursor-pointer rounded-full bg-danger px-4 py-2.5 text-sm font-bold text-white hover:brightness-95 sm:order-2"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
