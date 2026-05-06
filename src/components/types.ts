export interface UiOccurrence {
  occurrenceId: string;
  slug: string;
  title: string;
  locationName: string;
  address: string;
  latitude?: number;
  longitude?: number;
  alerts: string;
  generalInfo: string;
  start: string;
  end?: string;
}
