export type ListingType = "sale" | "rent";

export type PropertyType = "電梯大樓" | "公寓" | "透天厝" | "套房" | "店面";

export interface Listing {
  id: string;
  title: string;
  type: ListingType;
  propertyType: PropertyType;
  area: string;
  /** 顯示用地址：只到路段，不含完整門牌 */
  displayAddress: string;
  size: number; // 坪數
  layout: string; // 格局
  floor: string; // 樓層
  age: number; // 屋齡（年）
  price: number; // 售屋：萬元；租屋：元/月
  inquiryCount: number; // 累積「立即詢問」提交次數
  images: string[];
  description: string;
  lat: number;
  lng: number;
  tags: string[];
  agent: {
    name: string;
    phone: string;
  };
}

export const AREAS = [
  "台北市大安區",
  "台北市信義區",
  "台北市中山區",
  "台北市中正區",
  "台北市內湖區",
  "新北市板橋區",
  "新北市新莊區",
  "新北市永和區",
] as const;

export const PROPERTY_TYPES: PropertyType[] = [
  "電梯大樓",
  "公寓",
  "透天厝",
  "套房",
  "店面",
];

// 單一使用者（本人）自用網站，所有房源共用同一組聯絡資訊。
// 正式上線前請替換成真實姓名與電話。
const AGENT = { name: "黃振嘉", phone: "0952-621-422" };

function img(seed: string, n: number) {
  return Array.from(
    { length: n },
    (_, i) => `https://picsum.photos/seed/${seed}-${i}/1200/800`,
  );
}

export const LISTINGS: Listing[] = [
  {
    id: "1",
    title: "大安森林公園旁 3房電梯宅",
    type: "sale",
    propertyType: "電梯大樓",
    area: "台北市大安區",
    displayAddress: "大安區辛亥路二段",
    size: 32,
    layout: "3房2廳2衛",
    floor: "8F/12F",
    age: 15,
    price: 2680,
    inquiryCount: 18,
    images: img("a", 4),
    description:
      "近大安森林公園，生活機能完善，步行 5 分鐘可達捷運站。屋況保養良好，格局方正採光佳，社區有管理員 24 小時服務，適合小家庭自住。",
    lat: 25.0216,
    lng: 121.5427,
    tags: ["近公園", "採光佳", "近捷運"],
    agent: AGENT,
  },
  {
    id: "2",
    title: "信義區質感兩房",
    type: "rent",
    propertyType: "電梯大樓",
    area: "台北市信義區",
    displayAddress: "信義區松仁路",
    size: 18,
    layout: "2房1廳1衛",
    floor: "5F/20F",
    age: 8,
    price: 38000,
    inquiryCount: 9,
    images: img("b", 4),
    description:
      "鄰近信義商圈與市府捷運站，生活機能極佳。附近百貨林立，適合上班族租屋，屋內含基本家具家電，可立即入住。",
    lat: 25.033,
    lng: 121.565,
    tags: ["近捷運", "含家電", "商圈"],
    agent: AGENT,
  },
  {
    id: "3",
    title: "板橋捷運宅 三房兩衛",
    type: "sale",
    propertyType: "電梯大樓",
    area: "新北市板橋區",
    displayAddress: "板橋區文化路二段",
    size: 28,
    layout: "3房2廳2衛",
    floor: "6F/15F",
    age: 20,
    price: 1580,
    inquiryCount: 24,
    images: img("c", 4),
    description:
      "步行 8 分鐘至捷運板橋站，鄰近車站商圈與學區，生活機能便利。屋主自住保養，格局實用，適合首購族。",
    lat: 25.0126,
    lng: 121.4627,
    tags: ["近捷運", "學區", "首購推薦"],
    agent: AGENT,
  },
  {
    id: "4",
    title: "中山商圈 Loft 套房",
    type: "rent",
    propertyType: "套房",
    area: "台北市中山區",
    displayAddress: "中山區南京東路一段",
    size: 9,
    layout: "套房1房1衛",
    floor: "3F/6F",
    age: 25,
    price: 16000,
    inquiryCount: 6,
    images: img("d", 4),
    description:
      "挑高 Loft 套房，鄰近中山商圈與南京復興捷運站，適合單身上班族或學生，租金含網路與管理費。",
    lat: 25.0522,
    lng: 121.5271,
    tags: ["挑高", "近捷運", "含網路"],
    agent: AGENT,
  },
  {
    id: "5",
    title: "新莊透天別墅",
    type: "sale",
    propertyType: "透天厝",
    area: "新北市新莊區",
    displayAddress: "新莊區中正路",
    size: 45,
    layout: "4房3廳3衛",
    floor: "3F/3F",
    age: 5,
    price: 2980,
    inquiryCount: 12,
    images: img("e", 4),
    description:
      "全新整理透天別墅，三代同堂首選，前後院空間充足，附車位。鄰近新莊副都心與公園綠地。",
    lat: 25.0359,
    lng: 121.4318,
    tags: ["附車位", "有前後院", "新整理"],
    agent: AGENT,
  },
  {
    id: "6",
    title: "公館學區溫馨兩房",
    type: "rent",
    propertyType: "公寓",
    area: "台北市中正區",
    displayAddress: "中正區羅斯福路四段",
    size: 16,
    layout: "2房1廳1衛",
    floor: "4F/5F",
    age: 30,
    price: 26000,
    inquiryCount: 15,
    images: img("f", 4),
    description:
      "鄰近台大公館商圈，生活機能便利，適合小家庭或室友合租。屋內採光良好，附近市場、超商一應俱全。",
    lat: 25.0142,
    lng: 121.5347,
    tags: ["近學區", "生活機能佳"],
    agent: AGENT,
  },
  {
    id: "7",
    title: "內湖科技園區美寓",
    type: "sale",
    propertyType: "電梯大樓",
    area: "台北市內湖區",
    displayAddress: "內湖區瑞光路",
    size: 24,
    layout: "2房2廳1衛",
    floor: "11F/18F",
    age: 10,
    price: 1980,
    inquiryCount: 31,
    images: img("g", 4),
    description:
      "鄰近內湖科技園區，適合科技業上班族自住或投資置產，高樓層視野佳，社區規劃完善附游泳池健身房。",
    lat: 25.0798,
    lng: 121.5741,
    tags: ["近科技園區", "景觀佳", "社區泳池"],
    agent: AGENT,
  },
  {
    id: "8",
    title: "永和頂溪捷運小資宅",
    type: "rent",
    propertyType: "公寓",
    area: "新北市永和區",
    displayAddress: "永和區永和路二段",
    size: 12,
    layout: "1房1廳1衛",
    floor: "2F/5F",
    age: 28,
    price: 19000,
    inquiryCount: 27,
    images: img("h", 4),
    description:
      "步行 3 分鐘至頂溪捷運站，小資族首選租屋，租金含第四台，鄰近夜市與商圈生活機能佳。",
    lat: 25.0079,
    lng: 121.5151,
    tags: ["近捷運", "近夜市"],
    agent: AGENT,
  },
  {
    id: "9",
    title: "信義區新成屋兩房",
    type: "sale",
    propertyType: "電梯大樓",
    area: "台北市信義區",
    displayAddress: "信義區忠孝東路五段",
    size: 22,
    layout: "2房2廳1衛",
    floor: "10F/25F",
    age: 2,
    price: 2200,
    inquiryCount: 45,
    images: img("i", 4),
    description:
      "全新落成社區，鄰近信義商圈與捷運站，建材新穎，適合首購年輕家庭，社區規劃健身房與交誼廳。",
    lat: 25.0408,
    lng: 121.5673,
    tags: ["新成屋", "近捷運", "社區健身房"],
    agent: AGENT,
  },
  {
    id: "10",
    title: "中山雙捷運交會三房",
    type: "sale",
    propertyType: "電梯大樓",
    area: "台北市中山區",
    displayAddress: "中山區民權東路二段",
    size: 27,
    layout: "3房2廳2衛",
    floor: "9F/14F",
    age: 7,
    price: 2050,
    inquiryCount: 19,
    images: img("j", 4),
    description:
      "鄰近中山國小與松江南京雙捷運交會，生活機能便利，格局方正無暗房，適合小家庭長期自住。",
    lat: 25.0631,
    lng: 121.5325,
    tags: ["雙捷運", "格局方正"],
    agent: AGENT,
  },
  {
    id: "11",
    title: "永和仁愛公園景觀宅",
    type: "sale",
    propertyType: "電梯大樓",
    area: "新北市永和區",
    displayAddress: "永和區竹林路",
    size: 25,
    layout: "3房2廳2衛",
    floor: "12F/16F",
    age: 4,
    price: 1880,
    inquiryCount: 22,
    images: img("k", 4),
    description:
      "正對仁愛公園綠地，高樓層採光通風佳，屋齡新、屋況佳，鄰近頂溪捷運站與傳統市場。",
    lat: 25.0058,
    lng: 121.5178,
    tags: ["公園第一排", "屋齡新"],
    agent: AGENT,
  },
  {
    id: "12",
    title: "大安區簡約單身套房",
    type: "rent",
    propertyType: "套房",
    area: "台北市大安區",
    displayAddress: "大安區信義路四段",
    size: 8,
    layout: "套房1房1衛",
    floor: "5F/8F",
    age: 12,
    price: 17000,
    inquiryCount: 38,
    images: img("l", 4),
    description:
      "鄰近大安捷運站與信義商圈，簡約裝潢拎包入住，租金含網路，適合單身上班族。",
    lat: 25.0326,
    lng: 121.5436,
    tags: ["近捷運", "拎包入住"],
    agent: AGENT,
  },
  {
    id: "13",
    title: "內湖親子三房家庭宅",
    type: "rent",
    propertyType: "電梯大樓",
    area: "台北市內湖區",
    displayAddress: "內湖區成功路四段",
    size: 26,
    layout: "3房2廳2衛",
    floor: "7F/15F",
    age: 6,
    price: 42000,
    inquiryCount: 14,
    images: img("m", 4),
    description:
      "鄰近內湖國小與大湖公園，社區有兒童遊戲區，適合有小孩的家庭承租，車位另計。",
    lat: 25.0821,
    lng: 121.5877,
    tags: ["近學區", "親子友善"],
    agent: AGENT,
  },
  {
    id: "14",
    title: "新莊副都心兩房",
    type: "rent",
    propertyType: "電梯大樓",
    area: "新北市新莊區",
    displayAddress: "新莊區學府路",
    size: 19,
    layout: "2房2廳1衛",
    floor: "6F/12F",
    age: 9,
    price: 23000,
    inquiryCount: 33,
    images: img("n", 4),
    description:
      "鄰近新莊副都心與環球購物中心，生活機能齊全，鄰近捷運頭前庄站，租金含管理費。",
    lat: 25.0453,
    lng: 121.4432,
    tags: ["近捷運", "生活機能佳"],
    agent: AGENT,
  },
];

export function getListingById(id: string): Listing | undefined {
  return LISTINGS.find((l) => l.id === id);
}
