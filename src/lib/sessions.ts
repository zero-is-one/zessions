import type { CollectionEntry } from "astro:content";
import { addMonths } from "date-fns";
import pkg from "rrule";
const { RRule } = pkg;

export type SessionEntry = CollectionEntry<"sessions">;

export interface SessionOccurrence {
  occurrenceId: string;
  slug: string;
  title: string;
  locationName: string;
  address: string;
  latitude?: number;
  longitude?: number;
  alerts: string;
  generalInfo: string;
  start: Date;
  end?: Date;
}

const DEFAULT_DURATION_MS = 2 * 60 * 60 * 1000;

function sameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function mergeDateWithTime(baseDate: Date, sourceTime?: Date): Date {
  if (!sourceTime) {
    return new Date(baseDate);
  }

  const next = new Date(baseDate);
  next.setHours(sourceTime.getHours(), sourceTime.getMinutes(), 0, 0);
  return next;
}

function getDurationMs(session: SessionEntry): number {
  const { startDateTime, endDateTime } = session.data;
  if (!startDateTime || !endDateTime) {
    return DEFAULT_DURATION_MS;
  }

  const delta = endDateTime.getTime() - startDateTime.getTime();
  return delta > 0 ? delta : DEFAULT_DURATION_MS;
}

function applyExceptions(dates: Date[], exceptions: Date[]): Date[] {
  if (!exceptions.length) {
    return dates;
  }

  return dates.filter(
    (date) => !exceptions.some((exception) => sameDay(date, exception)),
  );
}

function singleDates(session: SessionEntry): Date[] {
  return session.data.startDateTime ? [session.data.startDateTime] : [];
}

function dateListDates(session: SessionEntry): Date[] {
  const dates = session.data.occurrenceDates;
  return dates.map((date) =>
    mergeDateWithTime(date, session.data.startDateTime),
  );
}

function rruleDates(
  session: SessionEntry,
  windowStart: Date,
  windowEnd: Date,
): Date[] {
  if (!session.data.recurrenceRule || !session.data.startDateTime) {
    return [];
  }

  const options = RRule.parseString(session.data.recurrenceRule);
  options.dtstart = session.data.startDateTime;

  if (session.data.recurrenceUntil) {
    options.until = session.data.recurrenceUntil;
  }
  if (session.data.recurrenceCount) {
    options.count = session.data.recurrenceCount;
  }

  const rule = new RRule(options);
  return rule.between(windowStart, windowEnd, true);
}

function inWindow(date: Date, windowStart: Date, windowEnd: Date): boolean {
  return date >= windowStart && date <= windowEnd;
}

export function expandSessionOccurrences(
  sessions: SessionEntry[],
  windowStart = new Date(),
  windowEnd = addMonths(new Date(), 6),
): SessionOccurrence[] {
  const all: SessionOccurrence[] = [];

  for (const session of sessions) {
    const durationMs = getDurationMs(session);
    const exceptions = session.data.exceptionDates;

    let baseDates: Date[] = [];
    switch (session.data.recurrenceType) {
      case "single":
        baseDates = singleDates(session);
        break;
      case "date-list":
        baseDates = dateListDates(session);
        break;
      case "rrule":
        baseDates = rruleDates(session, windowStart, windowEnd);
        break;
    }

    const dates = applyExceptions(baseDates, exceptions)
      .filter((date) => inWindow(date, windowStart, windowEnd))
      .sort((a, b) => a.getTime() - b.getTime());

    for (const start of dates) {
      all.push({
        occurrenceId: `${session.id}-${start.toISOString()}`,
        slug: session.id,
        title: session.data.title,
        locationName: session.data.locationName,
        address: session.data.address,
        latitude: session.data.latitude,
        longitude: session.data.longitude,
        alerts: session.data.alerts,
        generalInfo: session.data.generalInfo,
        start,
        end: new Date(start.getTime() + durationMs),
      });
    }
  }

  return all.sort((a, b) => a.start.getTime() - b.start.getTime());
}
