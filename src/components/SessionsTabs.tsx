import { lazy, Suspense, useEffect, useRef, useMemo, useState } from "react";
import { createPortal } from "react-dom";
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
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const isInitialMount = useRef(true);
  const isResetting = useRef(false);
  const hasUserInteracted = useRef(false);

  // Read URL on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const sessionSlug = params.get("session");
    if (sessionSlug && sessions.some((s) => s.slug === sessionSlug)) {
      setSelectedSlug(sessionSlug);
    }
    isInitialMount.current = false;
  }, [sessions]);

  // Update URL when selectedSlug changes
  useEffect(() => {
    if (!isInitialMount.current) {
      const params = new URLSearchParams(window.location.search);
      if (selectedSlug) {
        params.set("session", selectedSlug);
      } else {
        params.delete("session");
      }
      const newUrl = params.toString()
        ? `${window.location.pathname}?${params.toString()}`
        : window.location.pathname;
      window.history.replaceState(null, "", newUrl);
    }
  }, [selectedSlug]);

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
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    if (isResetting.current) {
      isResetting.current = false;
      return;
    }
    // Only auto-select if user has interacted (clicked filters, selected item, etc)
    if (
      hasUserInteracted.current &&
      (!selectedSlug ||
        !filteredSessions.some((item) => item.slug === selectedSlug))
    ) {
      setSelectedSlug(filteredSessions[0].slug);
    }
  }, [filteredSessions, selectedSlug]);

  useEffect(() => {
    if (!showFilters && !showInfo) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setShowFilters(false);
        setShowInfo(false);
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [showFilters, showInfo]);

  return (
    <>
      <section className="flex h-full min-h-0 flex-col gap-2 overflow-hidden">
        <div className="grid min-h-0 flex-1 gap-3 grid-cols-1 xl:overflow-hidden xl:grid-cols-[minmax(23rem,34%)_1fr] xl:items-stretch">
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
          <div className="glass min-h-0 overflow-y-auto p-2 sm:p-3 xl:order-1 flex flex-col gap-3 flex-1 xl:flex-none">
            <div className="sticky top-0 z-10 bg-white/90 backdrop-blur-sm border-b border-lichen/20 flex items-center justify-between gap-2 flex-shrink-0 px-2 py-2">
              <div className="flex items-center gap-2">
                <h1 className="font-display text-xl leading-none text-peat sm:text-2xl">
                  Find A Session NYC
                </h1>
                <button
                  type="button"
                  className="flex items-center gap-2 rounded border border-lichen/50 bg-white/80 px-3 py-1 text-sm font-semibold text-peat hover:bg-white transition"
                  onClick={() => setShowFilters(true)}
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
                    <line x1="4" y1="6" x2="20" y2="6"></line>
                    <line x1="4" y1="12" x2="20" y2="12"></line>
                    <line x1="4" y1="18" x2="20" y2="18"></line>
                  </svg>
                  Filter
                </button>
                {(scheduleFilter ||
                  dayFilter ||
                  timeFilter ||
                  selectedSlug) && (
                  <button
                    type="button"
                    onClick={() => {
                      isResetting.current = true;
                      setScheduleFilter(null);
                      setDayFilter(null);
                      setTimeFilter(null);
                      setSelectedSlug(null);
                      window.history.replaceState(
                        null,
                        "",
                        window.location.pathname,
                      );
                    }}
                    className="text-xs font-semibold text-lichen hover:text-lichen/80 transition underline"
                  >
                    Reset
                  </button>
                )}
              </div>
              <button
                type="button"
                onClick={() => setShowInfo(true)}
                title="About Find A Session NYC"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="16" x2="12" y2="12"></line>
                  <line x1="12" y1="8" x2="12.01" y2="8"></line>
                </svg>
              </button>
            </div>
            <SessionList
              sessions={filteredSessions}
              selectedSlug={selectedSlug}
              onSelectSession={(slug) => {
                hasUserInteracted.current = true;
                setSelectedSlug(slug);
              }}
              className="space-y-1"
            />
          </div>
        </div>
      </section>

      {showFilters &&
        createPortal(
          <>
            <div
              className="fixed inset-0 bg-black/30 z-40"
              onClick={() => setShowFilters(false)}
            />
            <div
              className="fixed inset-0 flex items-center justify-center z-50 p-4"
              onClick={() => setShowFilters(false)}
            >
              <div
                className="glass rounded-lg p-6 max-w-md w-full max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-display text-xl text-peat">
                    Filter Sessions
                  </h2>
                  <button
                    type="button"
                    className="text-peat/50 hover:text-peat text-2xl leading-none"
                    onClick={() => setShowFilters(false)}
                  >
                    ×
                  </button>
                </div>

                <div className="space-y-6">
                  <div>
                    <p className="font-semibold text-peat mb-3">Schedule</p>
                    <div className="flex flex-wrap gap-2">
                      {[
                        { key: null as Schedule | null, label: "All" },
                        ...SCHEDULES,
                      ].map(({ key, label }) => (
                        <button
                          key={key || "all"}
                          type="button"
                          onClick={() => {
                            hasUserInteracted.current = true;
                            setScheduleFilter(key);
                          }}
                          className={`px-4 py-2 rounded-full text-sm font-semibold transition ${
                            scheduleFilter === key
                              ? "bg-lichen text-white border border-lichen"
                              : "border border-lichen/50 text-peat/70 hover:border-lichen hover:text-peat"
                          }`}
                        >
                          {label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="font-semibold text-peat mb-3">Day</p>
                    <div className="flex flex-wrap gap-2">
                      {[{ key: null as Day | null, label: "All" }, ...DAYS].map(
                        ({ key, label }) => (
                          <button
                            key={key || "all"}
                            type="button"
                            onClick={() => {
                              hasUserInteracted.current = true;
                              setDayFilter(key);
                            }}
                            className={`px-4 py-2 rounded-full text-sm font-semibold transition ${
                              dayFilter === key
                                ? "bg-lichen text-white border border-lichen"
                                : "border text-peat/70 hover:text-peat"
                            }`}
                            style={
                              dayFilter === key
                                ? {
                                    backgroundColor:
                                      DAY_COLOR_HEX[key as Day] || "#8ba89a",
                                    borderColor:
                                      DAY_COLOR_HEX[key as Day] || "#8ba89a",
                                  }
                                : {
                                    borderColor:
                                      DAY_COLOR_HEX[key as Day] || "#d4cfc0",
                                  }
                            }
                          >
                            {label}
                          </button>
                        ),
                      )}
                    </div>
                  </div>

                  <div>
                    <p className="font-semibold text-peat mb-3">Time</p>
                    <div className="flex flex-wrap gap-2">
                      {[
                        { key: null as TimeOfDay | null, label: "All" },
                        ...TIMES_OF_DAY,
                      ].map(({ key, label }) => (
                        <button
                          key={key || "all"}
                          type="button"
                          onClick={() => {
                            hasUserInteracted.current = true;
                            setTimeFilter(key);
                          }}
                          className={`px-4 py-2 rounded-full text-sm font-semibold transition ${
                            timeFilter === key
                              ? "bg-lichen text-white border border-lichen"
                              : "border border-lichen/50 text-peat/70 hover:border-lichen hover:text-peat"
                          }`}
                        >
                          {label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {(scheduleFilter || dayFilter || timeFilter) && (
                    <button
                      type="button"
                      className="w-full rounded-lg border border-lichen/50 bg-lichen/20 px-4 py-2 text-sm font-semibold text-peat hover:bg-lichen/30 transition"
                      onClick={() => {
                        setScheduleFilter(null);
                        setDayFilter(null);
                        setTimeFilter(null);
                      }}
                    >
                      Clear Filters
                    </button>
                  )}
                </div>
              </div>
            </div>
          </>,
          document.body,
        )}

      {showInfo &&
        createPortal(
          <>
            <div
              className="fixed inset-0 bg-black/30 z-40"
              onClick={() => setShowInfo(false)}
            />
            <div
              className="fixed inset-0 flex items-center justify-center z-50 p-4"
              onClick={() => setShowInfo(false)}
            >
              <div
                className="glass rounded-lg p-6 max-w-md w-full max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-display text-xl text-peat">
                    About Find A Session NYC
                  </h2>
                  <button
                    type="button"
                    className="text-peat/50 hover:text-peat text-2xl leading-none"
                    onClick={() => setShowInfo(false)}
                  >
                    ×
                  </button>
                </div>

                <div className="space-y-4 text-sm text-peat/80 leading-relaxed">
                  <p>
                    <strong>Find A Session NYC</strong> is your guide to Irish
                    traditional music sessions happening around New York City.
                  </p>
                  <p>
                    Discover weekly sessions at bars and cultural centers
                    featuring authentic Irish music, from slow sessions perfect
                    for beginners to lively traditional sets.
                  </p>
                  <div>
                    <p className="font-semibold text-peat mb-2">How to Use:</p>
                    <ul className="space-y-1 list-disc list-inside">
                      <li>
                        Browse all sessions or use filters by schedule, day, and
                        time
                      </li>
                      <li>
                        Click on a session to see details and location on the
                        map
                      </li>
                      <li>Find the nearest sessions to you</li>
                    </ul>
                  </div>
                  <p className="pt-2 text-xs text-peat/60">
                    Made with ♪ for the Irish music community
                  </p>
                </div>
              </div>
            </div>
          </>,
          document.body,
        )}
    </>
  );
}
