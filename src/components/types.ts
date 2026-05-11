export type Schedule = "weekly" | "monthly" | "other";
export type Day =
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday"
  | "sunday";
export type TimeOfDay = "afternoon" | "evening" | "late-night";

export interface UiSession {
  slug: string;
  title?: string;
  locationName: string;
  address: string;
  latitude?: number;
  longitude?: number;
  alerts: string;
  generalInfo: string;
  startTime: string;
  endTime?: string;
  timeOfDay: TimeOfDay;
  schedule: Schedule;
  day?: Day;
}
