"use client";

import { useState } from "react";
import Link from "next/link";
import { CheckCircleIcon } from "@heroicons/react/24/outline";
import { AREAS, PROPERTY_TYPES, type ListingType } from "@/data/listings";
import ImageUploadPreview from "@/components/ImageUploadPreview";

export default function PostListingPage() {
  const [type, setType] = useState<ListingType>("sale");
  const [imageCount, setImageCount] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [submittedTitle, setSubmittedTitle] = useState("");

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    setSubmittedTitle(String(data.get("title") ?? ""));
    setSubmitted(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  if (submitted) {
    return (
      <div className="mx-auto flex max-w-lg flex-col items-center gap-4 px-4 py-24 text-center sm:px-6">
        <CheckCircleIcon className="h-16 w-16 text-rent" aria-hidden="true" />
        <h1 className="text-2xl font-black text-ink">已收到，審核中</h1>
        <p className="text-sm text-muted">
          {submittedTitle ? `「${submittedTitle}」` : "您的房源"}
          已送出，仲介會盡快審核並透過您留下的電話或 LINE 與您聯繫（此為原型頁面，尚未真正送出或儲存）。
        </p>
        <div className="mt-2 flex gap-3">
          <button
            type="button"
            onClick={() => setSubmitted(false)}
            className="cursor-pointer rounded-full border border-border px-5 py-2.5 text-sm font-bold text-ink hover:bg-canvas"
          >
            繼續刊登下一筆
          </button>
          <Link
            href="/"
            className="cursor-pointer rounded-full bg-navy px-5 py-2.5 text-sm font-bold text-navy-foreground"
          >
            返回房源列表
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-6 sm:px-6 sm:py-8">
      <h1 className="text-2xl font-black tracking-tight text-ink sm:text-3xl">
        刊登房源
      </h1>
      <p className="mt-1 text-sm text-muted">
        填寫房屋資訊，送出後由仲介審核（此為原型頁面，資料不會真的儲存）
      </p>

      <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-6">
        <Section title="基本資訊">
          <Field label="物件標題" required>
            <input
              name="title"
              required
              type="text"
              placeholder="例如：大安森林公園旁 3 房電梯宅"
              className="input"
            />
          </Field>

          <Field label="類型" required>
            <div className="inline-flex w-fit rounded-full border border-border bg-paper p-1">
              {(
                [
                  { key: "sale", label: "賣房" },
                  { key: "rent", label: "租房" },
                ] as { key: ListingType; label: string }[]
              ).map((opt) => (
                <button
                  key={opt.key}
                  type="button"
                  onClick={() => setType(opt.key)}
                  className={`cursor-pointer rounded-full px-5 py-1.5 text-sm font-bold transition ${
                    type === opt.key
                      ? "bg-navy text-navy-foreground"
                      : "text-muted hover:text-ink"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
            <input type="hidden" name="type" value={type} />
          </Field>

          <Field label="房型" required>
            <select name="propertyType" required defaultValue="" className="input">
              <option value="" disabled>
                請選擇房型
              </option>
              {PROPERTY_TYPES.map((pt) => (
                <option key={pt} value={pt}>
                  {pt}
                </option>
              ))}
            </select>
          </Field>
        </Section>

        <Section title="物件資訊">
          <Field label="區域" required>
            <select name="area" required defaultValue="" className="input">
              <option value="" disabled>
                請選擇區域
              </option>
              {AREAS.map((area) => (
                <option key={area} value={area}>
                  {area}
                </option>
              ))}
            </select>
          </Field>

          <Field label="地址" hint="僅需填到路段，例如「大安區辛亥路二段」，完整門牌不會公開">
            <input
              name="address"
              type="text"
              placeholder="例如：大安區辛亥路二段"
              className="input"
            />
          </Field>

          <div className="grid grid-cols-2 gap-4">
            <Field label="坪數" required>
              <input
                name="size"
                required
                type="number"
                min={1}
                inputMode="numeric"
                placeholder="例如：28"
                className="input"
              />
            </Field>
            <Field label="格局" required>
              <input
                name="layout"
                required
                type="text"
                placeholder="例如：3房2廳2衛"
                className="input"
              />
            </Field>
            <Field label="樓層" required>
              <input
                name="floor"
                required
                type="text"
                placeholder="例如：8F/12F"
                className="input"
              />
            </Field>
            <Field label="屋齡（年）" required>
              <input
                name="age"
                required
                type="number"
                min={0}
                inputMode="numeric"
                placeholder="例如：15"
                className="input"
              />
            </Field>
          </div>

          <Field label={type === "sale" ? "價格（萬）" : "月租金（元）"} required>
            <input
              name="price"
              required
              type="number"
              min={0}
              inputMode="numeric"
              placeholder={type === "sale" ? "例如：1680" : "例如：25000"}
              className="input"
            />
          </Field>

          <Field label="房屋描述">
            <textarea
              name="description"
              rows={4}
              placeholder="補充房屋特色、周邊機能等資訊"
              className="input resize-none"
            />
          </Field>
        </Section>

        <Section title="聯絡方式">
          <p className="-mt-1 text-sm text-muted">僅供仲介內部聯繫，不會公開顯示</p>
          <div className="grid grid-cols-2 gap-4">
            <Field label="姓名" required>
              <input
                name="submitterName"
                required
                type="text"
                autoComplete="name"
                placeholder="請輸入您的姓名"
                className="input"
              />
            </Field>
            <Field label="電話號碼" required>
              <input
                name="submitterPhone"
                required
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                placeholder="請輸入手機號碼"
                className="input"
              />
            </Field>
          </div>
          <Field label="LINE ID">
            <input
              name="submitterLineId"
              type="text"
              placeholder="選填，方便仲介用 LINE 聯繫"
              className="input"
            />
          </Field>
        </Section>

        <Section title="照片">
          <ImageUploadPreview onChange={setImageCount} />
        </Section>

        <button
          type="submit"
          className="w-full cursor-pointer rounded-full bg-yellow py-3.5 text-base font-bold text-yellow-foreground shadow-sm transition hover:brightness-95"
        >
          送出審核{imageCount > 0 ? `（${imageCount} 張照片）` : ""}
        </button>
      </form>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-border bg-paper p-4 sm:p-5">
      <h2 className="text-base font-bold text-ink">{title}</h2>
      {children}
    </div>
  );
}

function Field({
  label,
  required,
  hint,
  children,
}: {
  label: string;
  required?: boolean;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="flex flex-col gap-1.5 text-sm font-medium text-ink">
      <span>
        {label}
        {required && <span className="text-danger"> *</span>}
      </span>
      {children}
      {hint && <span className="text-sm font-normal text-muted">{hint}</span>}
    </label>
  );
}
