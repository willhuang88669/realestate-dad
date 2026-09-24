import type { ListingType, PropertyType } from "@/data/listings";

export type ReviewStatus = "pending" | "approved" | "rejected";

export interface PendingListing {
  id: string;
  title: string;
  type: ListingType;
  propertyType: PropertyType;
  area: string;
  address: string;
  size: number;
  layout: string;
  floor: string;
  age: number;
  price: number;
  images: string[];
  submittedAt: string;
  submitterName: string;
  submitterPhone: string;
  status: ReviewStatus;
}

function img(seed: string, n: number) {
  return Array.from(
    { length: n },
    (_, i) => `https://picsum.photos/seed/${seed}-${i}/900/600`,
  );
}

export const PENDING_LISTINGS: PendingListing[] = [
  {
    id: "p1",
    title: "大里中興路三房",
    type: "sale",
    propertyType: "電梯大樓",
    area: "台中市大里區",
    address: "大里區中興路",
    size: 26,
    layout: "3房2廳2衛",
    floor: "7F/13F",
    age: 12,
    price: 1780,
    images: img("p1", 3),
    submittedAt: "2026-09-24",
    submitterName: "游承翰",
    submitterPhone: "0910-234-567",
    status: "pending",
  },
  {
    id: "p2",
    title: "一中街夜市旁溫馨套房",
    type: "rent",
    propertyType: "套房",
    area: "台中市北區",
    address: "北區育才街",
    size: 8,
    layout: "套房1房1衛",
    floor: "4F/7F",
    age: 18,
    price: 14000,
    images: img("p2", 3),
    submittedAt: "2026-09-24",
    submitterName: "蔡明潔",
    submitterPhone: "0921-345-678",
    status: "pending",
  },
  {
    id: "p3",
    title: "太平全新兩房",
    type: "sale",
    propertyType: "電梯大樓",
    area: "台中市太平區",
    address: "太平區中山路",
    size: 22,
    layout: "2房2廳1衛",
    floor: "9F/16F",
    age: 3,
    price: 1680,
    images: img("p3", 3),
    submittedAt: "2026-09-23",
    submitterName: "林宗翰",
    submitterPhone: "0933-456-123",
    status: "approved",
  },
  {
    id: "p4",
    title: "南區建國市場邊老公寓",
    type: "rent",
    propertyType: "公寓",
    area: "台中市南區",
    address: "南區建國南路",
    size: 14,
    layout: "2房1廳1衛",
    floor: "3F/4F",
    age: 35,
    price: 15000,
    images: img("p4", 3),
    submittedAt: "2026-09-23",
    submitterName: "陳雅雯",
    submitterPhone: "0955-678-234",
    status: "rejected",
  },
  {
    id: "p5",
    title: "台中軟體園區景觀宅",
    type: "sale",
    propertyType: "電梯大樓",
    area: "台中市南屯區",
    address: "南屯區文心南路",
    size: 30,
    layout: "3房2廳2衛",
    floor: "15F/22F",
    age: 6,
    price: 2450,
    images: img("p5", 3),
    submittedAt: "2026-09-22",
    submitterName: "許育誠",
    submitterPhone: "0966-789-345",
    status: "pending",
  },
  {
    id: "p6",
    title: "西屯福星公園一房美寓",
    type: "rent",
    propertyType: "電梯大樓",
    area: "台中市西屯區",
    address: "西屯區朝富路",
    size: 11,
    layout: "1房1廳1衛",
    floor: "6F/10F",
    age: 9,
    price: 21000,
    images: img("p6", 3),
    submittedAt: "2026-09-22",
    submitterName: "吳佳蓉",
    submitterPhone: "0977-890-456",
    status: "pending",
  },
];
