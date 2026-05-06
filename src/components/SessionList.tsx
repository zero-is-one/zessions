import type { UiOccurrence } from "./types";

interface Props {
  occurrences: UiOccurrence[];
}

const nyFormatter = new Intl.DateTimeFormat("en-US", {
  timeZone: "America/New_York",
  weekday: "short",
  month: "short",
  day: "numeric",
  hour: "numeric",
  minute: "2-digit",
});

export default function SessionList({ occurrences }: Props) {
  if (!occurrences.length) {
    return (
      <p className="glass p-6 text-sm text-peat/70">
        No sessions found in the current date window.
      </p>
    );
  }

  return (
    <section className="grid gap-4" aria-label="Session list">
      {occurrences.map((item, index) => (
        <article
          key={item.occurrenceId}
          className="glass animate-rise p-5"
          style={{ animationDelay: `${Math.min(index * 50, 450)}ms` }}
        >
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h3 className="font-display text-2xl text-peat">{item.title}</h3>
              <p className="mt-1 text-sm text-peat/70">{item.locationName}</p>
            </div>
            <a
              className="rounded-full border border-lichen/50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-peat hover:bg-lichen/20"
              href={`/sessions/${item.slug}/`}
            >
              Details
            </a>
          </div>
          <div className="mt-4 grid gap-2 text-sm text-peat/85 sm:grid-cols-2">
            <p>
              <span className="font-semibold">When:</span>{" "}
              {nyFormatter.format(new Date(item.start))}
            </p>
            <p>
              <span className="font-semibold">Address:</span> {item.address}
            </p>
            <p>
              <span className="font-semibold">General info:</span>{" "}
              {item.generalInfo}
            </p>
          </div>
          {item.alerts && item.alerts !== "No alerts." && (
            <div className="mt-4 flex items-start gap-2 rounded-lg bg-red-600 px-4 py-3 text-sm font-medium text-white">
              <span
                className="mt-px shrink-0 text-base leading-none"
                aria-hidden="true"
              >
                &#9888;
              </span>
              <span>{item.alerts}</span>
            </div>
          )}
        </article>
      ))}
    </section>
  );
}
