import type { Metadata } from "next";
import { Noto_Sans_TC, Noto_Serif_TC } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ListingsStoreProvider } from "@/lib/listingsStore";
import "./globals.css";

const notoSansTC = Noto_Sans_TC({
  variable: "--font-noto-sans-tc",
  subsets: ["latin"],
  weight: "variable",
});

const notoSerifTC = Noto_Serif_TC({
  variable: "--font-noto-serif-tc",
  subsets: ["latin"],
  weight: "variable",
});

const SITE_URL = "https://willhuang88669.github.io/realestate-dad/";
const SITE_TITLE = "群義房屋 | 黃振嘉";
const SITE_DESCRIPTION = "台中租屋、售屋房源資訊，歡迎聯繫黃振嘉了解更多物件。";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_TITLE,
    template: `%s | ${SITE_TITLE}`,
  },
  description: SITE_DESCRIPTION,
  openGraph: {
    type: "website",
    locale: "zh_TW",
    siteName: SITE_TITLE,
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    images: [{ url: "logo.png", width: 1024, height: 1024, alt: SITE_TITLE }],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: ["logo.png"],
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="zh-Hant"
      className={`${notoSansTC.variable} ${notoSerifTC.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-canvas text-ink">
        <script
          dangerouslySetInnerHTML={{
            __html: `try{var t=localStorage.getItem('theme');if(t==='light'||t==='dark'){document.documentElement.setAttribute('data-theme',t);}}catch(e){}`,
          }}
        />
        <ListingsStoreProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </ListingsStoreProvider>
      </body>
    </html>
  );
}
