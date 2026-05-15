import { useEffect, useRef } from "react";
import {
  DAY_COLOR_HEX,
  DAY_LABELS,
  DAY_SHORT_LABELS,
  DAY_TEXT_CLASS,
} from "./dayMeta";
import { formatCompactTime, guessTimeToMinutes } from "../lib/time";
import type { UiSession } from "./types";

interface Props {
  sessions: UiSession[];
  selectedSlug?: string | null;
  onSelectSession?: (slug: string) => void;
  className?: string;
}

function toMobileVenueTitle(title: string): string {
  return title
    .trim()
    .replace(/^the\s+/i, "")
    .replace(/\band\b/gi, "&")
    .replace(/\bestablishment\b/gi, "Est.")
    .replace(/\bcenter\b/gi, "Ctr.")
    .replace(/\bavenue\b/gi, "Ave.")
    .replace(/\bstreet\b/gi, "St.")
    .replace(/\broad\b/gi, "Rd.")
    .replace(/\bboulevard\b/gi, "Blvd.")
    .replace(/\s{2,}/g, " ");
}

const DAY_ORDER = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
] as const;

const SCHEDULE_ORDER = ["weekly", "monthly", "other"] as const;

export default function SessionList({
  sessions,
  selectedSlug = null,
  onSelectSession,
  className,
}: Props) {
  const itemRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  useEffect(() => {
    if (!selectedSlug) return;
    const node = itemRefs.current[selectedSlug];
    if (node) {
      node.scrollIntoView({ block: "nearest", behavior: "smooth" });
    }
  }, [selectedSlug]);

  if (!sessions.length) {
    return <p className="glass p-6 text-sm text-peat/70">No sessions found.</p>;
  }

  function sortSessions(a: UiSession, b: UiSession): number {
    const timeA = guessTimeToMinutes(a.startTime);
    const timeB = guessTimeToMinutes(b.startTime);
    if (timeA !== null && timeB !== null && timeA !== timeB)
      return timeA - timeB;
    if (timeA !== null && timeB === null) return -1;
    if (timeA === null && timeB !== null) return 1;

    const scheduleA = SCHEDULE_ORDER.indexOf(a.schedule);
    const scheduleB = SCHEDULE_ORDER.indexOf(b.schedule);
    if (scheduleA !== scheduleB) return scheduleA - scheduleB;

    return a.title.localeCompare(b.title);
  }

  const groupedByDay = DAY_ORDER.map((day) => ({
    day,
    items: sessions.filter((item) => item.day === day).sort(sortSessions),
  })).filter((group) => group.items.length > 0);

  const noDayItems = sessions.filter((item) => !item.day).sort(sortSessions);

  function renderRow(item: UiSession) {
    const displayTitle = item.title || item.locationName;
    const mobileTitle = toMobileVenueTitle(displayTitle);

    return (
      <div key={item.slug} className="w-full border-b border-peat/10">
        <button
          ref={(node) => {
            itemRefs.current[item.slug] = node;
          }}
          type="button"
          className={`block min-w-full w-max border-l-4 px-2.5 py-2 text-left text-sm transition sm:w-full ${
            selectedSlug === item.slug
              ? "border-l-lichen bg-white/70"
              : "border-l-transparent bg-transparent hover:bg-white/45"
          }`}
          onClick={() => onSelectSession?.(item.slug)}
        >
          <div className="flex min-w-full w-max items-center gap-2 whitespace-nowrap sm:w-full">
            <span className="font-semibold text-peat" title={displayTitle}>
              <span className="sm:hidden">{mobileTitle}</span>
              <span className="hidden sm:inline">{displayTitle}</span>
            </span>
            <span className="text-peat/40">-</span>
            <span className="capitalize text-peat/75">{item.schedule}</span>
            {item.day && (
              <>
                <span className="text-peat/40">-</span>
                <span className={`font-semibold ${DAY_TEXT_CLASS[item.day]}`}>
                  <span className="sm:hidden">
                    {DAY_SHORT_LABELS[item.day]}
                  </span>
                  <span className="hidden sm:inline">
                    {DAY_LABELS[item.day]}
                  </span>
                </span>
              </>
            )}
            <span className="text-peat/40">-</span>
            <span className="text-peat/75">
              {formatCompactTime(item.startTime)}
              {item.endTime ? ` - ${formatCompactTime(item.endTime)}` : ""}
            </span>
          </div>
        </button>
      </div>
    );
  }

  return (
    <section
      className={className ?? "space-y-4 overflow-x-auto sm:overflow-x-visible"}
      aria-label="Session list"
    >
      {groupedByDay.map((group, index) => (
        <div key={group.day} className={`space-y-1 ${index > 0 ? "pt-3" : ""}`}>
          <h3
            className={`px-2 py-1 text-xs font-bold uppercase tracking-[0.12em] ${DAY_TEXT_CLASS[group.day]}`}
            style={{ backgroundColor: `${DAY_COLOR_HEX[group.day]}14` }}
          >
            <span className="sm:hidden">{DAY_SHORT_LABELS[group.day]}</span>
            <span className="hidden sm:inline">{DAY_LABELS[group.day]}</span>
          </h3>
          {group.items.map((item) => renderRow(item))}
        </div>
      ))}

      {noDayItems.length > 0 && (
        <div className="space-y-1 pt-3">
          <h3 className="bg-peat/10 px-2 py-1 text-xs font-bold uppercase tracking-[0.12em] text-peat">
            Other
          </h3>
          {noDayItems.map((item) => renderRow(item))}
        </div>
      )}
    </section>
  );
}
