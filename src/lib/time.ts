import type { TimeOfDay } from "../components/types";

export function guessTimeToMinutes(input: string | undefined): number | null {
  if (!input) return null;

  const match = input
    .toLowerCase()
    .match(/(\d{1,2})(?::(\d{2}))?\s*(?:ish)?\s*(am|pm|a|p)?/i);

  if (!match) return null;

  let hour = parseInt(match[1], 10);
  const minute = parseInt(match[2] ?? "0", 10);
  const meridian = match[3]?.toLowerCase();

  if (Number.isNaN(hour) || Number.isNaN(minute) || minute > 59) return null;

  if (meridian) {
    if (hour < 1 || hour > 12) return null;
    const isPm = meridian.startsWith("p");
    hour = (hour % 12) + (isPm ? 12 : 0);
  } else if (hour > 23) {
    return null;
  }

  return hour * 60 + minute;
}

export function guessTimeOfDay(startTime: string | undefined): TimeOfDay {
  const mins = guessTimeToMinutes(startTime);
  if (mins === null) return "evening";
  if (mins < 17 * 60) return "afternoon";
  if (mins < 20 * 60) return "evening";
  return "late-night";
}

export function formatCompactTime(input: string | undefined): string {
  if (!input) return "";

  const match = input
    .trim()
    .match(/^(\d{1,2})(?::(\d{2}))?\s*(?:ish)?\s*(am|pm|a|p)?$/i);

  if (!match) return input;

  const originalHour = parseInt(match[1], 10);
  const minute = parseInt(match[2] ?? "0", 10);
  const meridian = match[3]?.toLowerCase();

  if (
    Number.isNaN(originalHour) ||
    Number.isNaN(minute) ||
    minute > 59 ||
    originalHour > 23
  ) {
    return input;
  }

  const hasMeridian = Boolean(meridian);

  if (hasMeridian) {
    if (originalHour < 1 || originalHour > 12) return input;
    const suffix = meridian!.startsWith("p") ? "pm" : "am";
    const hour12 = originalHour % 12 === 0 ? 12 : originalHour % 12;
    return minute === 0 ? `${hour12}${suffix}` : `${hour12}:${String(minute).padStart(2, "0")}${suffix}`;
  }

  if (originalHour > 12 || originalHour === 0) {
    const suffix = originalHour >= 12 ? "pm" : "am";
    const hour12 = originalHour % 12 === 0 ? 12 : originalHour % 12;
    return minute === 0 ? `${hour12}${suffix}` : `${hour12}:${String(minute).padStart(2, "0")}${suffix}`;
  }

  return minute === 0
    ? `${originalHour}`
    : `${originalHour}:${String(minute).padStart(2, "0")}`;
}
