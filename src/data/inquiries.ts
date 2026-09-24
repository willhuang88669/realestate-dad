export type InquiryStatus = "已聯絡" | "已約看" | "已成交";

export interface Inquiry {
  id: string;
  listingTitle: string;
  listingId: string;
  name: string;
  phone: string;
  message: string;
  submittedAt: string;
  status: InquiryStatus;
  /** 仲介針對這則詢問的公開回覆，顯示在房源詳情頁的問答區 */
  reply?: string;
}

export const INQUIRIES: Inquiry[] = [
  {
    id: "q1",
    listingTitle: "福星公園旁 3房電梯宅",
    listingId: "1",
    name: "王小明",
    phone: "0912-345-678",
    message: "您好，我對這間房子有興趣，想約看屋時間。",
    submittedAt: "2026-09-24 14:20",
    status: "已約看",
    reply: "您好，感謝詢問！平日晚上或週末都可以安排看屋，請直接來電或用 LINE 跟我約時間即可。",
  },
  {
    id: "q2",
    listingTitle: "北屯區質感兩房",
    listingId: "2",
    name: "陳怡君",
    phone: "0922-111-333",
    message: "請問可以寵物同住嗎？想了解租約細節。",
    submittedAt: "2026-09-24 10:05",
    status: "已聯絡",
  },
  {
    id: "q3",
    listingTitle: "大里中興商圈 三房兩衛",
    listingId: "3",
    name: "李冠廷",
    phone: "0933-222-444",
    message: "想了解車位是否含在售價內。",
    submittedAt: "2026-09-23 19:40",
    status: "已成交",
    reply: "有的，車位已包含在售價內，是一個平面車位，權狀有獨立登記。",
  },
  {
    id: "q4",
    listingTitle: "一中街商圈 Loft 套房",
    listingId: "4",
    name: "張雅婷",
    phone: "0955-333-555",
    message: "請問即可入住嗎？想這週末看房。",
    submittedAt: "2026-09-23 16:12",
    status: "已聯絡",
  },
  {
    id: "q5",
    listingTitle: "太平透天別墅",
    listingId: "5",
    name: "黃志豪",
    phone: "0966-444-666",
    message: "想確認產權狀況與是否可貸款。",
    submittedAt: "2026-09-22 09:30",
    status: "已約看",
  },
  {
    id: "q6",
    listingTitle: "中興大學學區溫馨兩房",
    listingId: "6",
    name: "林詩涵",
    phone: "0977-555-777",
    message: "請問租金含哪些費用？可以簽兩年約嗎？",
    submittedAt: "2026-09-22 08:15",
    status: "已聯絡",
    reply: "租金含管理費，水電另計。可以簽兩年約，簽約時需付兩個月押金。",
  },
  {
    id: "q7",
    listingTitle: "台中軟體園區美寓",
    listingId: "7",
    name: "周柏宇",
    phone: "0988-666-888",
    message: "有興趣投資置產，想約時間詳談。",
    submittedAt: "2026-09-21 20:50",
    status: "已成交",
    reply: "感謝您的詢問，這裡鄰近科技園區，租金投報率不錯，歡迎來電約時間詳談。",
  },
];
