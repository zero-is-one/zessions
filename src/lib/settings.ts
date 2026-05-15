import type { CollectionEntry } from "astro:content";
import type { SiteSettings } from "../components/types";

export type SettingsEntry = CollectionEntry<"settings">;

export const defaultSiteSettings: SiteSettings = {
  footerNote:
    "We try our best to compile all the NYC sessions. For the latest, visit the",
  aboutTitle: "About Find A Session NYC",
  aboutIntro:
    "Discover weekly sessions at bars and cultural centers featuring authentic Irish music, from slow sessions perfect for beginners to lively traditional sets.",
  aboutSupport:
    "Follow the Facebook group and Spotify playlist above for the latest updates and session tunes.",
  aboutFooter: "Made with ♪ for the Irish music community",
};

export function mapSiteSettings(
  settings: SettingsEntry | undefined,
): SiteSettings {
  if (!settings) {
    return defaultSiteSettings;
  }

  return {
    footerNote: settings.data.footerNote ?? defaultSiteSettings.footerNote,
    aboutTitle: settings.data.aboutTitle ?? defaultSiteSettings.aboutTitle,
    aboutIntro: settings.data.aboutIntro ?? defaultSiteSettings.aboutIntro,
    aboutSupport:
      settings.data.aboutSupport ?? defaultSiteSettings.aboutSupport,
    aboutFooter: settings.data.aboutFooter ?? defaultSiteSettings.aboutFooter,
  };
}
