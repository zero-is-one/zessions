import { lazy, Suspense, useMemo, useState } from "react";
import SessionList from "./SessionList";
import SessionCalendar from "./SessionCalendar";
import type { UiOccurrence } from "./types";

const SessionMap = lazy(() => import("./SessionMap"));

type TabKey = "list" | "calendar" | "map";

interface Props {
  occurrences: UiOccurrence[];
}

function initialTab(): TabKey {
  if (typeof window === "undefined") {
    return "list";
  }

  const hash = window.location.hash.replace("#", "");
  if (hash === "calendar" || hash === "map" || hash === "list") {
    return hash;
  }
  return "list";
}

export default function SessionsTabs({ occurrences }: Props) {
  const [activeTab, setActiveTab] = useState<TabKey>(initialTab);

  const sorted = useMemo(
    () =>
      [...occurrences].sort(
        (a, b) => Date.parse(a.start) - Date.parse(b.start),
      ),
    [occurrences],
  );

  function switchTab(tab: TabKey) {
    setActiveTab(tab);
    window.history.replaceState({}, "", `#${tab}`);
  }

  return (
    <section className="space-y-4">
      <div
        className="glass flex flex-wrap items-center gap-2 p-3"
        role="tablist"
        aria-label="Session views"
      >
        <button
          type="button"
          className="tab-button"
          data-active={activeTab === "list"}
          role="tab"
          aria-selected={activeTab === "list"}
          onClick={() => switchTab("list")}
        >
          Ongoing List
        </button>
        <button
          type="button"
          className="tab-button"
          data-active={activeTab === "calendar"}
          role="tab"
          aria-selected={activeTab === "calendar"}
          onClick={() => switchTab("calendar")}
        >
          Calendar
        </button>
        <button
          type="button"
          className="tab-button"
          data-active={activeTab === "map"}
          role="tab"
          aria-selected={activeTab === "map"}
          onClick={() => switchTab("map")}
        >
          Map
        </button>
      </div>

      <div role="tabpanel" aria-live="polite">
        {activeTab === "list" && <SessionList occurrences={sorted} />}
        {activeTab === "calendar" && <SessionCalendar occurrences={sorted} />}
        {activeTab === "map" && (
          <Suspense
            fallback={
              <p className="glass p-6 text-sm text-peat/70">Loading map…</p>
            }
          >
            <SessionMap occurrences={sorted} />
          </Suspense>
        )}
      </div>
    </section>
  );
}
