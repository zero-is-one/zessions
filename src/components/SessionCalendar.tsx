import { useMemo, useState } from "react";
import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  parseISO,
  startOfMonth,
  startOfWeek,
  subMonths,
} from "date-fns";
import type { UiOccurrence } from "./types";

interface Props {
  occurrences: UiOccurrence[];
}

const nyFormatter = new Intl.DateTimeFormat("en-US", {
  timeZone: "America/New_York",
  hour: "numeric",
  minute: "2-digit",
});

export default function SessionCalendar({ occurrences }: Props) {
  const [monthCursor, setMonthCursor] = useState(new Date());

  const events = useMemo(
    () => occurrences.map((item) => ({ ...item, date: parseISO(item.start) })),
    [occurrences],
  );

  const monthStart = startOfMonth(monthCursor);
  const monthEnd = endOfMonth(monthCursor);
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 0 });
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });
  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  return (
    <section aria-label="Calendar view" className="glass p-4 sm:p-6">
      <div className="mb-4 flex items-center justify-between">
        <button
          type="button"
          className="rounded-full border border-lichen/50 px-3 py-1 text-sm font-semibold text-peat hover:bg-lichen/20"
          onClick={() => setMonthCursor((prev) => subMonths(prev, 1))}
        >
          Prev
        </button>
        <h3 className="font-display text-2xl text-peat">
          {format(monthCursor, "MMMM yyyy")}
        </h3>
        <button
          type="button"
          className="rounded-full border border-lichen/50 px-3 py-1 text-sm font-semibold text-peat hover:bg-lichen/20"
          onClick={() => setMonthCursor((prev) => addMonths(prev, 1))}
        >
          Next
        </button>
      </div>
      <div className="grid grid-cols-7 gap-2 text-center text-xs font-semibold uppercase tracking-wide text-peat/70">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((dow) => (
          <div key={dow}>{dow}</div>
        ))}
      </div>
      <div className="mt-2 grid grid-cols-7 gap-2">
        {days.map((day) => {
          const dayEvents = events.filter((event) =>
            isSameDay(event.date, day),
          );
          const inMonth = isSameMonth(day, monthCursor);

          return (
            <div
              key={day.toISOString()}
              className={`min-h-28 rounded-xl border p-2 ${
                inMonth
                  ? "border-lichen/30 bg-white/70"
                  : "border-transparent bg-white/30 text-peat/40"
              }`}
            >
              <p className="text-xs font-semibold">{format(day, "d")}</p>
              <div className="mt-1 space-y-1">
                {dayEvents.slice(0, 2).map((event) => (
                  <a
                    key={event.occurrenceId}
                    href={`/sessions/${event.slug}/`}
                    className="block rounded-md bg-harbor/15 px-2 py-1 text-left text-[11px] font-medium text-peat hover:bg-harbor/25"
                    title={`${event.title} at ${event.locationName}`}
                  >
                    <span className="block truncate">{event.title}</span>
                    <span className="block truncate text-[10px] text-peat/70">
                      {nyFormatter.format(event.date)}
                    </span>
                  </a>
                ))}
                {dayEvents.length > 2 ? (
                  <p className="px-1 text-[11px] font-semibold text-ember">
                    +{dayEvents.length - 2} more
                  </p>
                ) : null}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
