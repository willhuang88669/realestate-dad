"use client";

import { useState } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import type { Listing } from "@/data/listings";

export default function EditListingModal({
  listing,
  onSave,
  onClose,
}: {
  listing: Listing;
  onSave: (patch: Partial<Listing>) => void;
  onClose: () => void;
}) {
  const [title, setTitle] = useState(listing.title);
  const [price, setPrice] = useState(String(listing.price));
  const [size, setSize] = useState(String(listing.size));
  const [layout, setLayout] = useState(listing.layout);
  const [floor, setFloor] = useState(listing.floor);
  const [age, setAge] = useState(String(listing.age));
  const [description, setDescription] = useState(listing.description);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSave({
      title: title.trim(),
      price: Number(price) || 0,
      size: Number(size) || 0,
      layout: layout.trim(),
      floor: floor.trim(),
      age: Number(age) || 0,
      description: description.trim(),
    });
    onClose();
  }

  return (
    <div
      className="fixed inset-0 z-1000 flex items-end justify-center sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-label={`編輯「${listing.title}」`}
    >
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      <form
        onSubmit={handleSubmit}
        className="relative flex max-h-[90vh] w-full max-w-md flex-col gap-4 overflow-y-auto rounded-t-2xl bg-paper p-5 shadow-2xl sm:rounded-2xl"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-ink">編輯房源</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="關閉"
            className="cursor-pointer rounded-full p-1.5 hover:bg-canvas"
          >
            <XMarkIcon className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        <label className="flex flex-col gap-1 text-sm font-medium text-ink">
          物件標題
          <input
            required
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="input"
          />
        </label>

        <div className="grid grid-cols-2 gap-3">
          <label className="flex flex-col gap-1 text-sm font-medium text-ink">
            {listing.type === "sale" ? "價格（萬）" : "月租金（元）"}
            <input
              required
              type="number"
              min={0}
              inputMode="numeric"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="input"
            />
          </label>
          <label className="flex flex-col gap-1 text-sm font-medium text-ink">
            坪數
            <input
              required
              type="number"
              min={1}
              inputMode="numeric"
              value={size}
              onChange={(e) => setSize(e.target.value)}
              className="input"
            />
          </label>
          <label className="flex flex-col gap-1 text-sm font-medium text-ink">
            格局
            <input
              required
              type="text"
              value={layout}
              onChange={(e) => setLayout(e.target.value)}
              className="input"
            />
          </label>
          <label className="flex flex-col gap-1 text-sm font-medium text-ink">
            樓層
            <input
              required
              type="text"
              value={floor}
              onChange={(e) => setFloor(e.target.value)}
              className="input"
            />
          </label>
          <label className="col-span-2 flex flex-col gap-1 text-sm font-medium text-ink">
            屋齡（年）
            <input
              required
              type="number"
              min={0}
              inputMode="numeric"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              className="input"
            />
          </label>
        </div>

        <label className="flex flex-col gap-1 text-sm font-medium text-ink">
          房屋描述
          <textarea
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="input resize-none"
          />
        </label>

        <div className="flex gap-3 pt-1">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 cursor-pointer rounded-full border border-border py-2.5 text-sm font-bold text-ink hover:bg-canvas"
          >
            取消
          </button>
          <button
            type="submit"
            className="flex-1 cursor-pointer rounded-full bg-navy py-2.5 text-sm font-bold text-navy-foreground hover:brightness-95"
          >
            儲存
          </button>
        </div>
      </form>
    </div>
  );
}
