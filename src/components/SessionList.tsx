import { useEffect, useRef, useState } from "react";
import { DAY_COLOR_HEX, DAY_LABELS, DAY_TEXT_CLASS } from "./dayMeta";
import type { UiSession } from "./types";

interface Props {
  sessions: UiSession[];
  selectedSlug?: string | null;
  onSelectSession?: (slug: string) => void;
  className?: string;
}

function formatTime(t: string): string {
  const [hStr, mStr] = t.split(":");
  let h = parseInt(hStr, 10);
  const m = parseInt(mStr, 10);
  const ampm = h < 12 || h === 0 ? "am" : "pm";
  if (h === 0) h = 12;
  else if (h > 12) h -= 12;
  return m === 0 ? `${h}${ampm}` : `${h}:${mStr}${ampm}`;
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
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);

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

  function toMinutes(t: string): number {
    const [hStr, mStr] = t.split(":");
    const h = parseInt(hStr ?? "0", 10);
    const m = parseInt(mStr ?? "0", 10);
    return h * 60 + m;
  }

  function sortSessions(a: UiSession, b: UiSession): number {
    const timeA = toMinutes(a.startTime);
    const timeB = toMinutes(b.startTime);
    if (timeA !== timeB) return timeA - timeB;

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
    const directionsUrl =
      item.latitude && item.longitude
        ? `https://www.google.com/maps?q=${item.latitude},${item.longitude}`
        : `https://www.google.com/maps/search/${encodeURIComponent(item.address)}`;

    const handleCopyLink = async () => {
      const sessionUrl = `${window.location.origin}${window.location.pathname}?session=${item.slug}`;
      try {
        await navigator.clipboard.writeText(sessionUrl);
        setCopiedSlug(item.slug);
        setTimeout(() => setCopiedSlug(null), 2000);
      } catch (err) {
        console.error("Failed to copy:", err);
      }
    };

    return (
      <div
        key={item.slug}
        className="flex items-center gap-2 border-b border-peat/10"
      >
        <button
          ref={(node) => {
            itemRefs.current[item.slug] = node;
          }}
          type="button"
          className={`flex-1 border-l-4 px-2.5 py-2 text-left text-sm transition ${
            selectedSlug === item.slug
              ? "border-l-lichen bg-white/70"
              : "border-l-transparent bg-transparent hover:bg-white/45"
          }`}
          onClick={() => onSelectSession?.(item.slug)}
        >
          <div className="flex items-center gap-2 overflow-hidden whitespace-nowrap">
            <span className="truncate font-semibold text-peat">
              {item.title}
            </span>
            <span className="text-peat/40">-</span>
            <span className="capitalize text-peat/75">{item.schedule}</span>
            {item.day && (
              <>
                <span className="text-peat/40">-</span>
                <span className={`font-semibold ${DAY_TEXT_CLASS[item.day]}`}>
                  {DAY_LABELS[item.day]}
                </span>
              </>
            )}
            <span className="text-peat/40">-</span>
            <span className="truncate text-peat/75">
              {formatTime(item.startTime)}
              {item.endTime ? `-${formatTime(item.endTime)}` : ""}
            </span>
          </div>
        </button>
        <a
          href={directionsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-none inline-flex items-center gap-1 px-2.5 py-2 text-lichen hover:text-lichen/80 transition"
          title="Get directions"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"></polygon>
            <polyline points="8 2 8 18"></polyline>
            <polyline points="16 2 16 18"></polyline>
          </svg>
        </a>
        <button
          type="button"
          onClick={handleCopyLink}
          className="flex-none inline-flex items-center gap-1 px-2.5 py-2 text-peat/60 hover:text-peat transition"
          title="Copy link to clipboard"
        >
          {copiedSlug === item.slug ? (
            <>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
              <span className="text-xs font-semibold whitespace-nowrap">
                Link copied
              </span>
            </>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
              <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
            </svg>
          )}
        </button>
      </div>
    );
  }

  return (
    <section className={className ?? "space-y-4"} aria-label="Session list">
      {groupedByDay.map((group, index) => (
        <div key={group.day} className={`space-y-1 ${index > 0 ? "pt-3" : ""}`}>
          <h3
            className={`px-2 py-1 text-xs font-bold uppercase tracking-[0.12em] ${DAY_TEXT_CLASS[group.day]}`}
            style={{ backgroundColor: `${DAY_COLOR_HEX[group.day]}14` }}
          >
            {DAY_LABELS[group.day]}
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
