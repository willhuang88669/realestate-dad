"use client";

import { useEffect, useRef, useState } from "react";
import { PhotoIcon, XMarkIcon } from "@heroicons/react/24/outline";

interface PreviewImage {
  id: string;
  url: string;
}

export default function ImageUploadPreview({
  onChange,
}: {
  onChange?: (count: number) => void;
}) {
  const [images, setImages] = useState<PreviewImage[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    onChange?.(images.length);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [images.length]);

  useEffect(() => {
    return () => {
      images.forEach((img) => URL.revokeObjectURL(img.url));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleFiles(fileList: FileList | null) {
    if (!fileList) return;
    const next = Array.from(fileList).map((file) => ({
      id: `${file.name}-${file.lastModified}-${Math.random().toString(36).slice(2)}`,
      url: URL.createObjectURL(file),
    }));
    setImages((prev) => [...prev, ...next]);
  }

  function removeImage(id: string) {
    setImages((prev) => {
      const target = prev.find((img) => img.id === id);
      if (target) URL.revokeObjectURL(target.url);
      return prev.filter((img) => img.id !== id);
    });
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
        {images.map((img) => (
          <div key={img.id} className="relative aspect-square overflow-hidden rounded-xl border border-border">
            {/* eslint-disable-next-line @next/next/no-img-element -- local blob preview, next/image cannot optimize object URLs */}
            <img src={img.url} alt="上傳預覽" className="h-full w-full object-cover" />
            <button
              type="button"
              onClick={() => removeImage(img.id)}
              aria-label="移除這張照片"
              className="absolute right-1 top-1 cursor-pointer rounded-full bg-black/60 p-1 text-white hover:bg-black/80"
            >
              <XMarkIcon className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
          </div>
        ))}

        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="flex aspect-square cursor-pointer flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed border-border text-muted hover:border-navy hover:text-navy"
        >
          <PhotoIcon className="h-6 w-6" aria-hidden="true" />
          <span className="text-sm font-medium">新增照片</span>
        </button>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => {
          handleFiles(e.target.files);
          e.target.value = "";
        }}
      />
      <p className="text-sm text-muted">
        僅供預覽，此原型頁面不會真的上傳照片到伺服器。已選擇 {images.length} 張。
      </p>
    </div>
  );
}
