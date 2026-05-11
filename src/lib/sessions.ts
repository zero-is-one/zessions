import type { CollectionEntry } from "astro:content";
import type { TimeOfDay, UiSession } from "../components/types";

export type SessionEntry = CollectionEntry<"sessions">;

function getTimeOfDay(startTime: string | undefined): TimeOfDay {
  if (!startTime) return "evening";
  const [hStr, mStr] = startTime.split(":");
  const h = parseInt(hStr, 10);
  const m = parseInt(mStr ?? "0", 10);
  const mins = h * 60 + m;
  if (mins < 17 * 60) return "afternoon";
  if (mins < 20 * 60) return "evening";
  return "late-night";
}

export function mapSessions(sessions: SessionEntry[]): UiSession[] {
  return sessions
    .map((session) => ({
      slug: session.id,
      title: session.data.title ?? session.data.locationName,
      locationName: session.data.locationName,
      address: session.data.address,
      googleMapsLink: session.data.googleMapsLink,
      latitude: session.data.latitude,
      longitude: session.data.longitude,
      alerts: session.data.alerts,
      generalInfo: session.data.generalInfo,
      startTime: session.data.startTime,
      endTime: session.data.endTime,
      timeOfDay: getTimeOfDay(session.data.startTime),
      schedule: session.data.schedule,
      day: session.data.day,
    }))
    .sort((a, b) => a.title.localeCompare(b.title));
}
