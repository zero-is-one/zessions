import type { Day } from "./types";

export const DAY_LABELS: Record<Day, string> = {
  monday: "Monday",
  tuesday: "Tuesday",
  wednesday: "Wednesday",
  thursday: "Thursday",
  friday: "Friday",
  saturday: "Saturday",
  sunday: "Sunday",
  other: "Other",
};

export const DAY_SHORT_LABELS: Record<Day, string> = {
  monday: "Mon",
  tuesday: "Tue",
  wednesday: "Wed",
  thursday: "Thu",
  friday: "Fri",
  saturday: "Sat",
  sunday: "Sun",
  other: "Other",
};

export const DAY_COLOR_HEX: Record<Day, string> = {
  monday: "#2563eb",
  tuesday: "#0891b2",
  wednesday: "#16a34a",
  thursday: "#a16207",
  friday: "#dc2626",
  saturday: "#7c3aed",
  sunday: "#be185d",
  other: "#475569",
};

export const DAY_TEXT_CLASS: Record<Day, string> = {
  monday: "text-blue-700",
  tuesday: "text-cyan-700",
  wednesday: "text-green-700",
  thursday: "text-amber-700",
  friday: "text-red-700",
  saturday: "text-violet-700",
  sunday: "text-pink-700",
  other: "text-slate-700",
};
