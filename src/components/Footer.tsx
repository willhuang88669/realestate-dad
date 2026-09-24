import { telHref } from "@/lib/format";

export default function Footer() {
  return (
    <footer className="whitespace-nowrap border-t border-border px-4 py-6 text-center font-serif text-sm tracking-wide text-ink sm:text-base">
      群義房屋 | 黃振嘉 (
      <a href={telHref("0952-621-422")} className="text-navy underline-offset-2 hover:underline">
        0952-621-422
      </a>
      )
    </footer>
  );
}
