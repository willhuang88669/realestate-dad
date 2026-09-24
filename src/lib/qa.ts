import type { Listing } from "@/data/listings";
import { INQUIRIES } from "@/data/inquiries";

export interface QAItem {
  id: string;
  message: string;
  reply: string;
}

const FILLER_QA: { q: string; a: string }[] = [
  { q: "請問屋況如何，有沒有漏水或壁癌問題？", a: "屋況良好，屋主有定期保養，目前沒有漏水或壁癌問題。" },
  { q: "管理費大概多少？包含哪些項目？", a: "管理費依坪數計算，包含公共區域清潔、電梯保養與保全服務。" },
  { q: "附近生活機能如何？走路到捷運站要多久？", a: "生活機能便利，附近有超商、市場，步行到捷運站約 8-10 分鐘。" },
  { q: "價格可以再談嗎？", a: "價格有一定彈性，歡迎約時間看屋後再詳細討論。" },
  { q: "車位是平面還是機械式？", a: "是平面車位，進出方便，不需排隊等候。" },
  { q: "現況是空屋還是有人居住？", a: "目前是空屋狀態，看屋方便，隨時可以安排。" },
  { q: "貸款成數大概可以到多少？", a: "依目前市場行情，貸款成數約可到七到八成，實際依銀行鑑價為準。" },
  { q: "可以寵物同住嗎？", a: "可以的，社區允許飼養寵物，但請留意公共空間清潔。" },
  { q: "屋齡看起來有點久，有整修過嗎？", a: "屋主幾年前有重新整修過廚房與衛浴，屋況維持得不錯。" },
  { q: "附近學區如何？", a: "學區為市區明星學區，鄰近國小、國中皆在步行範圍內。" },
  { q: "什麼時候可以安排看屋？", a: "平日晚上或週末都可以，請直接來電或用 LINE 約時間。" },
  { q: "格局方正嗎？有沒有傾斜或畸零空間？", a: "格局方正，沒有明顯畸零空間，採光通風都不錯。" },
];

function hashString(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = (h * 31 + s.charCodeAt(i)) >>> 0;
  }
  return h;
}

/**
 * 每個房源固定顯示 1-10 則訪客提問：優先使用後台真的填過回覆的詢問紀錄，
 * 不足的部分用固定模板依房源 id 決定性挑選填滿，方便預覽排版在筆數不同時的樣子。
 */
export function getListingQA(listing: Listing): QAItem[] {
  const real = INQUIRIES.filter((q) => q.listingId === listing.id && q.reply).map((q) => ({
    id: q.id,
    message: q.message,
    reply: q.reply as string,
  }));

  const hash = hashString(listing.id);
  const target = (hash % 10) + 1;
  const needed = Math.max(0, target - real.length);
  const offset = hash % FILLER_QA.length;

  const filler: QAItem[] = Array.from({ length: Math.min(needed, FILLER_QA.length) }, (_, i) => {
    const item = FILLER_QA[(offset + i) % FILLER_QA.length];
    return { id: `filler-${listing.id}-${i}`, message: item.q, reply: item.a };
  });

  return [...real, ...filler];
}
