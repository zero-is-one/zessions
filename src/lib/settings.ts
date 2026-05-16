import type { CollectionEntry } from "astro:content";
import type { SiteSettings } from "../components/types";
import { CITY_NAME } from "./city";

export type SettingsEntry = CollectionEntry<"settings">;

export const defaultSiteSettings: SiteSettings = {
  footerNote: `We try our best to compile all the ${CITY_NAME} sessions. For the latest, visit the`,
  aboutTitle: `About Find A Session ${CITY_NAME}`,
  aboutIntro:
    "Discover weekly sessions at bars and cultural centers featuring authentic Irish music, from slow sessions perfect for beginners to lively traditional sets.",
  aboutSupport:
    "Follow the Facebook group and Spotify playlist above for the latest updates and session tunes.",
  aboutFooter: "Made with ♪ for the Irish music community",
};

function normalizeLegacyCityText(value: string): string {
  return value.replace(/\bNYC\b/g, CITY_NAME);
}

export function mapSiteSettings(
  settings: SettingsEntry | undefined,
): SiteSettings {
  if (!settings) {
    return defaultSiteSettings;
  }

  return {
    footerNote: normalizeLegacyCityText(
      settings.data.footerNote ?? defaultSiteSettings.footerNote,
    ),
    aboutTitle: normalizeLegacyCityText(
      settings.data.aboutTitle ?? defaultSiteSettings.aboutTitle,
    ),
    aboutIntro: normalizeLegacyCityText(
      settings.data.aboutIntro ?? defaultSiteSettings.aboutIntro,
    ),
    aboutSupport: normalizeLegacyCityText(
      settings.data.aboutSupport ?? defaultSiteSettings.aboutSupport,
    ),
    aboutFooter: normalizeLegacyCityText(
      settings.data.aboutFooter ?? defaultSiteSettings.aboutFooter,
    ),
  };
}
