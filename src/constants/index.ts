import type { TierConfig } from "../lib/types";

export const RESERVATION_DURATION_MS = 5 * 60 * 1000;

export const CONCURRENCY_INTERVAL_MS = 5000;

export const API_DELAY_MS = 1500;

export const API_FAILURE_RATE = 0.2;

export const TIER_CONFIGS: TierConfig[] = [
  {
    tier: "vip",
    label: "VIP",
    price: 350,
    color: "#d4a017",
    bgColor: "#fef3c7",
    rows: ["A", "B"],
    seatsPerRow: 10,
  },
  {
    tier: "premium",
    label: "Premium",
    price: 250,
    color: "#3b82f6",
    bgColor: "#dbeafe",
    rows: ["C", "D", "E"],
    seatsPerRow: 12,
  },
  {
    tier: "general",
    label: "General",
    price: 150,
    color: "#10b981",
    bgColor: "#d1fae5",
    rows: ["F", "G", "H", "I", "J"],
    seatsPerRow: 14,
  },
];

export const TIER_COLOR_MAP: Record<
  string,
  { bg: string; border: string; text: string }
> = {
  vip: {
    bg: "bg-amber-500/20",
    border: "border-amber-500",
    text: "text-amber-400",
  },
  premium: {
    bg: "bg-blue-500/20",
    border: "border-blue-500",
    text: "text-blue-400",
  },
  general: {
    bg: "bg-emerald-500/20",
    border: "border-emerald-500",
    text: "text-emerald-400",
  },
};
