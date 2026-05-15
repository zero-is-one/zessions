import { lazy, Suspense, useEffect, useRef, useMemo, useState } from "react";
import LogoLockup from "./LogoLockup";
import { createPortal } from "react-dom";
import { DAY_SHORT_LABELS } from "./dayMeta";
import { FacebookIcon, InfoIcon, SpotifyIcon } from "./icons";
import SessionList from "./SessionList";
import type {
  Day,
  Schedule,
  SiteSettings,
  TimeOfDay,
  UiSession,
} from "./types";

const SessionMap = lazy(() => import("./SessionMap"));
const FACEBOOK_URL = "https://www.facebook.com/groups/NYSessionHub";
const SPOTIFY_URL =
  "https://open.spotify.com/playlist/7eVRXEdJnWbvJ0ZA16C73v?si=cWW-eaX6Spq6E-QKi_KoGQ&pi=8PPbPWeRTHeT0&nd=1&dlsi=7f97cef4640d427a";

interface Props {
  sessions: UiSession[];
  settings: SiteSettings;
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

export default function SessionsTabs({ sessions, settings }: Props) {
  const [scheduleFilter, setScheduleFilter] = useState<Schedule | null>(null);
  const [dayFilter, setDayFilter] = useState<Day | null>(null);
  const [timeFilter, setTimeFilter] = useState<TimeOfDay | null>(null);
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);
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
    if (!showInfo) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setShowInfo(false);
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [showInfo]);

  const renderInlineMarkdownLink = (text: string) => {
    const parts: React.ReactNode[] = [];
    const linkPattern = /\[([^\]]+)\]\(([^)]+)\)/g;
    let lastIndex = 0;
    let match: RegExpExecArray | null;

    while ((match = linkPattern.exec(text))) {
      if (match.index > lastIndex) {
        parts.push(text.slice(lastIndex, match.index));
      }

      parts.push(
        <a
          key={`${match.index}-${match[2]}`}
          href={match[2]}
          target="_blank"
          rel="noopener noreferrer"
          className="text-lichen hover:text-lichen/80 underline"
        >
          {match[1]}
        </a>,
      );

      lastIndex = match.index + match[0].length;
    }

    if (lastIndex < text.length) {
      parts.push(text.slice(lastIndex));
    }

    return parts.length ? parts : text;
  };

  return (
    <>
      <section className="flex h-full min-h-0 flex-col gap-2 overflow-hidden">
        <div className="glass flex items-end justify-between gap-3 px-3 py-2 sm:px-4 sm:py-3 lg:items-end">
          <div className="flex min-w-0 flex-1 flex-col gap-3">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:gap-4">
              <div className="flex w-full items-center gap-2 lg:w-auto lg:flex-none">
                <h1 className="font-display text-peat flex flex-1 items-center gap-2">
                  <span className="sr-only">Find A Session NYC</span>
                  <LogoLockup />
                </h1>
                <div className="shrink-0 flex items-center gap-1 lg:hidden">
                  <a
                    href={FACEBOOK_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="Facebook"
                    aria-label="Facebook"
                    className="inline-flex h-10 w-10 items-center justify-center text-peat/80 hover:text-lichen transition"
                  >
                    <FacebookIcon width={20} height={20} />
                  </a>
                  <a
                    href={SPOTIFY_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="Spotify"
                    aria-label="Spotify"
                    className="inline-flex h-10 w-10 items-center justify-center text-peat/80 hover:text-lichen transition"
                  >
                    <SpotifyIcon width={20} height={20} />
                  </a>
                  <button
                    type="button"
                    onClick={() => setShowInfo(true)}
                    title="About Find A Session NYC"
                    aria-label="Info"
                    className="inline-flex h-10 w-10 items-center justify-center text-peat/80 hover:text-lichen transition"
                  >
                    <InfoIcon width={20} height={20} />
                  </button>
                </div>
              </div>

              <div className="flex w-full items-center gap-2 lg:w-[40rem] lg:mr-auto">
                <div className="grid flex-1 grid-cols-3 gap-2">
                  <label className="flex flex-col gap-1 text-xs font-semibold uppercase tracking-[0.08em] text-peat/70">
                    Schedule
                    <select
                      value={scheduleFilter ?? "all"}
                      onChange={(e) => {
                        hasUserInteracted.current = true;
                        setScheduleFilter(
                          e.target.value === "all"
                            ? null
                            : (e.target.value as Schedule),
                        );
                      }}
                      className="rounded border border-lichen/50 bg-white/90 px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-peat focus:border-lichen focus:outline-none h-8 sm:h-10"
                    >
                      <option value="all">Any</option>
                      {SCHEDULES.map(({ key, label }) => (
                        <option key={key} value={key}>
                          {label}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="flex flex-col gap-1 text-xs font-semibold uppercase tracking-[0.08em] text-peat/70">
                    Day
                    <select
                      value={dayFilter ?? "all"}
                      onChange={(e) => {
                        hasUserInteracted.current = true;
                        setDayFilter(
                          e.target.value === "all"
                            ? null
                            : (e.target.value as Day),
                        );
                      }}
                      className="rounded border border-lichen/50 bg-white/90 px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-peat focus:border-lichen focus:outline-none h-8 sm:h-10"
                    >
                      <option value="all">Any</option>
                      {DAYS.map(({ key, label }) => (
                        <option key={key} value={key}>
                          {label}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="flex flex-col gap-1 text-xs font-semibold uppercase tracking-[0.08em] text-peat/70">
                    Time
                    <select
                      value={timeFilter ?? "all"}
                      onChange={(e) => {
                        hasUserInteracted.current = true;
                        setTimeFilter(
                          e.target.value === "all"
                            ? null
                            : (e.target.value as TimeOfDay),
                        );
                      }}
                      className="rounded border border-lichen/50 bg-white/90 px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-peat focus:border-lichen focus:outline-none h-8 sm:h-10"
                    >
                      <option value="all">Any</option>
                      {TIMES_OF_DAY.map(({ key, label }) => (
                        <option key={key} value={key}>
                          {label}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    if (
                      !(
                        scheduleFilter ||
                        dayFilter ||
                        timeFilter ||
                        selectedSlug
                      )
                    )
                      return;
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
                  className={`mt-3.5 whitespace-nowrap text-xs font-semibold transition underline duration-200 ${
                    scheduleFilter || dayFilter || timeFilter || selectedSlug
                      ? "text-lichen hover:text-lichen/80 opacity-100 pointer-events-auto"
                      : "opacity-0 pointer-events-none"
                  }`}
                  tabIndex={
                    scheduleFilter || dayFilter || timeFilter || selectedSlug
                      ? 0
                      : -1
                  }
                  aria-disabled={
                    !(scheduleFilter || dayFilter || timeFilter || selectedSlug)
                  }
                >
                  Reset
                </button>
              </div>
            </div>
          </div>

          <div className="shrink-0 self-center hidden lg:flex items-center gap-3 text-sm font-semibold">
            <a
              href={FACEBOOK_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-9 items-center gap-2 rounded border border-peat/25 px-3 text-peat/80 hover:border-lichen/40 hover:text-lichen transition"
            >
              <FacebookIcon width={16} height={16} />
              Facebook
            </a>
            <a
              href={SPOTIFY_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-9 items-center gap-2 rounded border border-peat/25 px-3 text-peat/80 hover:border-lichen/40 hover:text-lichen transition"
            >
              <SpotifyIcon width={16} height={16} />
              Spotify
            </a>
            <button
              type="button"
              onClick={() => setShowInfo(true)}
              title="About Find A Session NYC"
              aria-label="Info"
              className="inline-flex h-9 w-9 items-center justify-center rounded border border-peat/25 text-peat/80 hover:border-lichen/40 hover:text-lichen transition"
            >
              <InfoIcon width={16} height={16} />
            </button>
          </div>
        </div>

        <div className="grid min-h-0 flex-1 gap-3 grid-cols-1 xl:overflow-hidden xl:grid-cols-[minmax(19rem,30%)_1fr] xl:items-stretch">
          <Suspense
            fallback={
              <p className="glass p-6 text-sm text-peat/70">Loading map…</p>
            }
          >
            <div className="h-[400px] sm:h-[62dvh] xl:order-2 xl:h-full">
              <SessionMap
                sessions={filteredSessions}
                selectedSlug={selectedSlug}
                onSelectSession={setSelectedSlug}
                className="h-full w-full"
              />
            </div>
          </Suspense>
          <div className="glass min-h-0 overflow-y-auto p-1 xl:order-1 flex flex-col gap-3 flex-1 xl:flex-none">
            <SessionList
              sessions={filteredSessions}
              selectedSlug={selectedSlug}
              onSelectSession={(slug) => {
                hasUserInteracted.current = true;
                setSelectedSlug(slug);
              }}
              className="space-y-1"
            />
            <div className="mt-4 text-center text-xs text-peat/70 pb-4">
              <p className="leading-relaxed">
                {renderInlineMarkdownLink(settings.footerNote)}
              </p>
            </div>
          </div>
        </div>
      </section>

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
                    {settings.aboutTitle}
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
                  <p>{settings.aboutIntro}</p>
                  <p>{settings.aboutSupport}</p>

                  <p className="pt-2 text-xs text-peat/60">
                    {settings.aboutFooter}
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
