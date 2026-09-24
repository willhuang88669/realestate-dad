"use client";

import { useEffect, useState } from "react";
import { SunIcon, MoonIcon } from "@heroicons/react/24/outline";

type Theme = "light" | "dark";

function getSystemTheme(): Theme {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme | null>(null);

  useEffect(() => {
    // Synced once on mount from localStorage/matchMedia, not derivable during SSR.
    const stored = window.localStorage.getItem("theme");
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTheme(stored === "light" || stored === "dark" ? stored : getSystemTheme());
  }, []);

  function toggle() {
    const next: Theme = (theme ?? getSystemTheme()) === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);
    window.localStorage.setItem("theme", next);
  }

  // 尚未在 client 端讀取到實際主題前，先占位避免版面跳動，不渲染圖示。
  if (theme === null) {
    return <span className="inline-block h-9 w-9 sm:h-10 sm:w-10" aria-hidden="true" />;
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={theme === "dark" ? "切換成亮色模式" : "切換成暗色模式"}
      className="inline-flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full border border-ink text-ink transition hover:bg-ink hover:text-paper sm:h-10 sm:w-10"
    >
      {theme === "dark" ? (
        <SunIcon className="h-4 w-4 sm:h-5 sm:w-5" aria-hidden="true" />
      ) : (
        <MoonIcon className="h-4 w-4 sm:h-5 sm:w-5" aria-hidden="true" />
      )}
    </button>
  );
}
