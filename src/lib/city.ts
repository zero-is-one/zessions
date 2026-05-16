function toTitleCase(value: string): string {
  return value.replace(/-/g, " ").replace(/\b\w/g, (ch) => ch.toUpperCase());
}

const cityFromEnv = import.meta.env.PUBLIC_CITY_SLUG;
export const CITY_SLUG = (
  typeof cityFromEnv === "string" && cityFromEnv.trim() ? cityFromEnv : "nyc"
).toLowerCase();
export const CITY_NAME =
  {
    nyc: "NYC",
    philly: "Philly",
    boston: "Boston",
    chicago: "Chicago",
    sf: "San Francisco",
  }[CITY_SLUG] || toTitleCase(CITY_SLUG);
export const CITY_DISPLAY = CITY_SLUG.toUpperCase();
