import type { CollectionEntry } from "astro:content";
import type { TimeOfDay, UiSession } from "../components/types";
import { guessTimeOfDay } from "./time";

export type SessionEntry = CollectionEntry<"sessions">;

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
      timeOfDay: guessTimeOfDay(session.data.startTime),
      schedule: session.data.schedule,
      day: session.data.day,
    }))
    .sort((a, b) => a.title.localeCompare(b.title));
}
