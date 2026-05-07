import { lazy, Suspense, useEffect, useMemo, useState } from "react";
import { DAY_COLOR_HEX, DAY_SHORT_LABELS } from "./dayMeta";
import SessionList from "./SessionList";
import type { Day, Schedule, TimeOfDay, UiSession } from "./types";

const SessionMap = lazy(() => import("./SessionMap"));

interface Props {
  sessions: UiSession[];
}

const SCHEDULES: { key: Schedule; label: string }[] = [
  { key: "weekly", label: "Weekly" },
  { key: "monthly", label: "Monthly" },
  { key: "other", label: "Other" },
];

const DAYS: { key: Day; label: string }[] = [
  { key: "monday", label: DAY_SHORT_LABELS.monday },
  { key: "tuesday", label: DAY_SHORT_LABELS.tuesday },
  { key: "wednesday", label: DAY_SHORT_LABELS.wednesday },
  { key: "thursday", label: DAY_SHORT_LABELS.thursday },
  { key: "friday", label: DAY_SHORT_LABELS.friday },
  { key: "saturday", label: DAY_SHORT_LABELS.saturday },
  { key: "sunday", label: DAY_SHORT_LABELS.sunday },
];

const TIMES_OF_DAY: { key: TimeOfDay; label: string }[] = [
  { key: "afternoon", label: "Afternoon" },
  { key: "evening", label: "Evening" },
  { key: "late-night", label: "Late night" },
];

export default function SessionsTabs({ sessions }: Props) {
  const [scheduleFilter, setScheduleFilter] = useState<Schedule | null>(null);
  const [dayFilter, setDayFilter] = useState<Day | null>(null);
  const [timeFilter, setTimeFilter] = useState<TimeOfDay | null>(null);
  const [selectedSlug, setSelectedSlug] = useState<string | null>(
    sessions[0]?.slug ?? null,
  );

  const filteredSessions = useMemo(
    () =>
      sessions.filter(
        (item) =>
          (scheduleFilter === null || item.schedule === scheduleFilter) &&
          (dayFilter === null || item.day === dayFilter) &&
          (timeFilter === null || item.timeOfDay === timeFilter),
      ),
    [sessions, scheduleFilter, dayFilter, timeFilter],
  );

  useEffect(() => {
    if (!filteredSessions.length) {
      setSelectedSlug(null);
      return;
    }
    if (
      !selectedSlug ||
      !filteredSessions.some((item) => item.slug === selectedSlug)
    ) {
      setSelectedSlug(filteredSessions[0].slug);
    }
  }, [filteredSessions, selectedSlug]);

  return (
    <section className="flex h-full min-h-0 flex-col gap-2 overflow-hidden">
      <div className="glass flex items-center gap-2 overflow-x-auto whitespace-nowrap p-2">
        <h1 className="mr-2 flex-none font-display text-2xl leading-none text-peat sm:text-3xl">
          Zessions
        </h1>
        <label className="flex flex-none items-center gap-1.5 text-sm text-peat/70">
          <span className="font-semibold text-peat">Schedule</span>
          <select
            className="border border-lichen/50 bg-white/80 px-2 py-1 text-sm text-peat focus:outline-none"
            value={scheduleFilter ?? ""}
            onChange={(e) =>
              setScheduleFilter((e.target.value as Schedule) || null)
            }
          >
            <option value="">All</option>
            {SCHEDULES.map(({ key, label }) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-none items-center gap-1.5 text-sm text-peat/70">
          <span className="font-semibold text-peat">Day</span>
          <select
            className="border border-lichen/50 bg-white/80 px-2 py-1 text-sm text-peat focus:outline-none"
            value={dayFilter ?? ""}
            onChange={(e) => setDayFilter((e.target.value as Day) || null)}
            style={
              dayFilter
                ? { color: DAY_COLOR_HEX[dayFilter], fontWeight: 700 }
                : undefined
            }
          >
            <option value="">All</option>
            {DAYS.map(({ key, label }) => (
              <option
                key={key}
                value={key}
                style={{ color: DAY_COLOR_HEX[key] }}
              >
                {label}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-none items-center gap-1.5 text-sm text-peat/70">
          <span className="font-semibold text-peat">Time</span>
          <select
            className="border border-lichen/50 bg-white/80 px-2 py-1 text-sm text-peat focus:outline-none"
            value={timeFilter ?? ""}
            onChange={(e) =>
              setTimeFilter((e.target.value as TimeOfDay) || null)
            }
          >
            <option value="">All</option>
            {TIMES_OF_DAY.map(({ key, label }) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>
        </label>
        {(scheduleFilter || dayFilter || timeFilter) && (
          <button
            type="button"
            className="flex-none text-xs font-semibold text-peat/50 hover:text-peat"
            onClick={() => {
              setScheduleFilter(null);
              setDayFilter(null);
              setTimeFilter(null);
            }}
          >
            Clear
          </button>
        )}
      </div>

      <div className="grid min-h-0 flex-1 gap-3 xl:overflow-hidden xl:grid-cols-[minmax(23rem,34%)_1fr] xl:items-stretch">
        <Suspense
          fallback={
            <p className="glass p-6 text-sm text-peat/70">Loading map…</p>
          }
        >
          <div className="h-[56dvh] min-h-[320px] sm:h-[62dvh] xl:order-2 xl:h-full">
            <SessionMap
              sessions={filteredSessions}
              selectedSlug={selectedSlug}
              onSelectSession={setSelectedSlug}
              className="h-full w-full"
            />
          </div>
        </Suspense>
        <div className="glass min-h-0 overflow-y-auto p-2 sm:p-3 xl:order-1">
          <SessionList
            sessions={filteredSessions}
            selectedSlug={selectedSlug}
            onSelectSession={setSelectedSlug}
            className="space-y-1"
          />
        </div>
      </div>
    </section>
  );
}
