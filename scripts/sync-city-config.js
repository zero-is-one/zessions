// sync-city-config.js
// Syncs city-specific paths in .pages.yml and fallback city in src/lib/city.ts
import { execSync } from "child_process";
import { readFileSync, writeFileSync } from "fs";

const defaultCity = "nyc";

function getCityFromBranch() {
  try {
    const branch = execSync("git rev-parse --abbrev-ref HEAD", {
      stdio: ["ignore", "pipe", "ignore"],
    })
      .toString()
      .trim()
      .toLowerCase();

    if (/^[a-z0-9-]+$/.test(branch)) {
      return branch;
    }

    console.warn(
      `Branch \"${branch}\" is not a valid city slug, defaulting to \"${defaultCity}\"`,
    );
    return defaultCity;
  } catch {
    console.warn(
      `Could not determine git branch, defaulting to \"${defaultCity}\"`,
    );
    return defaultCity;
  }
}

function updatePagesYml(city) {
  const ymlPath = ".pages.yml";
  let yml = readFileSync(ymlPath, "utf8");

  const sessionRegex =
    /path:\s*src\/content\/(sessions|cities\/[^/]+\/sessions)/g;
  const settingsRegex =
    /path:\s*src\/content\/(settings\/settings.md|cities\/[^/]+\/settings\/settings.md)/g;

  yml = yml.replace(sessionRegex, `path: src/content/cities/${city}/sessions`);
  yml = yml.replace(
    settingsRegex,
    `path: src/content/cities/${city}/settings/settings.md`,
  );

  writeFileSync(ymlPath, yml, "utf8");
}

function updateCityFile(city) {
  const cityPath = "src/lib/city.ts";
  let cityFile = readFileSync(cityPath, "utf8");

  const fallbackRegex = /(\?\s*cityFromEnv\s*:\s*")[a-z0-9-]+(")/;
  if (!fallbackRegex.test(cityFile)) {
    throw new Error(
      "Could not find CITY_SLUG fallback in src/lib/city.ts to update.",
    );
  }

  cityFile = cityFile.replace(fallbackRegex, `$1${city}$2`);
  writeFileSync(cityPath, cityFile, "utf8");
}

const city = getCityFromBranch();
updatePagesYml(city);
updateCityFile(city);

console.log(`Synced city config for: ${city}`);
