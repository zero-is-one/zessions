import { existsSync, readFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const pagesYmlCandidates = [
  join(process.cwd(), ".pages.yml"),
  join(__dirname, "../../.pages.yml"),
];
const pagesYmlPath = pagesYmlCandidates.find((candidate) =>
  existsSync(candidate),
);

if (!pagesYmlPath) {
  throw new Error(
    `Could not find .pages.yml. Checked: ${pagesYmlCandidates.join(", ")}`,
  );
}

const pagesYml = readFileSync(pagesYmlPath, "utf-8");
const cityMatch = pagesYml.match(
  /path:\s*src\/content\/cities\/([a-z0-9-]+)\/sessions/i,
);

if (!cityMatch?.[1]) {
  throw new Error(
    "Could not determine city: add a valid sessions path in .pages.yml (src/content/cities/<city>/sessions)",
  );
}

function toTitleCase(value: string): string {
  return value.replace(/-/g, " ").replace(/\b\w/g, (ch) => ch.toUpperCase());
}

export const CITY_SLUG = cityMatch[1].toLowerCase();
export const CITY_NAME = toTitleCase(CITY_SLUG);
export const CITY_DISPLAY = CITY_SLUG.toUpperCase();
