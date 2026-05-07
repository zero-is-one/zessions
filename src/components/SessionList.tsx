import { useEffect, useRef } from "react";
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

const DAY_LABELS: Record<(typeof DAY_ORDER)[number], string> = {
  monday: "Mon.",
  tuesday: "Tue.",
  wednesday: "Wed.",
  thursday: "Thu.",
  friday: "Fri.",
  saturday: "Sat.",
  sunday: "Sun.",
};

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
    return (
      <button
        key={item.slug}
        ref={(node) => {
          itemRefs.current[item.slug] = node;
        }}
        type="button"
        className={`w-full border px-3 py-2 text-left text-sm transition ${
          selectedSlug === item.slug
            ? "border-lichen bg-lichen/15 ring-1 ring-lichen/60"
            : "border-transparent bg-white/70 hover:border-lichen/60"
        }`}
        onClick={() => onSelectSession?.(item.slug)}
      >
        <div className="flex items-center gap-2 overflow-hidden whitespace-nowrap">
          <span className="truncate font-semibold text-peat">{item.title}</span>
          <span className="text-peat/40">-</span>
          <span className="capitalize text-peat/75">{item.schedule}</span>
          {item.day && (
            <>
              <span className="text-peat/40">-</span>
              <span className="text-peat/75">{DAY_LABELS[item.day]}</span>
            </>
          )}
          <span className="text-peat/40">-</span>
          <span className="truncate text-peat/75">
            {formatTime(item.startTime)}
            {item.endTime ? `-${formatTime(item.endTime)}` : ""}
          </span>
        </div>
      </button>
    );
  }

  return (
    <section className={className ?? "space-y-3"} aria-label="Session list">
      {groupedByDay.map((group) => (
        <div key={group.day} className="space-y-1">
          <h3 className="px-1 text-xs font-semibold uppercase tracking-wide text-peat/60">
            {DAY_LABELS[group.day]}
          </h3>
          {group.items.map((item) => renderRow(item))}
        </div>
      ))}

      {noDayItems.length > 0 && (
        <div className="space-y-1">
          <h3 className="px-1 text-xs font-semibold uppercase tracking-wide text-peat/60">
            Other
          </h3>
          {noDayItems.map((item) => renderRow(item))}
        </div>
      )}
    </section>
  );
}
