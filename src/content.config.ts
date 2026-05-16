import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";
import { readFileSync } from "fs";
import { resolve } from "path";

const pagesYml = readFileSync(resolve(".pages.yml"), "utf-8");
const cityMatch = pagesYml.match(/path:\s*src\/content\/(\w+)\/sessions/);
const city = cityMatch?.[1] ?? process.env.CITY_BRANCH ?? "nyc";

const sessions = defineCollection({
  loader: glob({
    pattern: "**/*.md",
    base: `./src/content/cities/${city}/sessions`,
  }),
  schema: z.object({
    title: z.string().min(1).optional(),
    locationName: z.string().min(1),
    address: z.string().min(1),
    googleMapsLink: z.string().optional(),
    latitude: z.number().optional(),
    longitude: z.number().optional(),
    description: z.string().optional(),
    alerts: z.string().default("No alerts."),
    generalInfo: z.string().default(""),
    startTime: z.string(),
    endTime: z.string().optional(),
    schedule: z.enum(["weekly", "monthly", "other"]),
    day: z
      .enum([
        "monday",
        "tuesday",
        "wednesday",
        "thursday",
        "friday",
        "saturday",
        "sunday",
      ])
      .optional(),
    draft: z.boolean().default(false),
  }),
});

const settings = defineCollection({
  loader: glob({
    pattern: "settings.md",
    base: `./src/content/cities/${city}/settings`,
  }),
  schema: z.object({
    footerNote: z
      .string()
      .default(
        "We try our best to compile all the NYC sessions. For the latest, visit the",
      ),
    aboutTitle: z.string().default("About Find A Session NYC"),
    aboutIntro: z
      .string()
      .default(
        "Discover weekly sessions at bars and cultural centers featuring authentic Irish music, from slow sessions perfect for beginners to lively traditional sets.",
      ),
    aboutSupport: z
      .string()
      .default(
        "Follow the Facebook group and Spotify playlist above for the latest updates and session tunes.",
      ),
    aboutFooter: z
      .string()
      .default("Made with ♪ for the Irish music community"),
    draft: z.boolean().default(false),
  }),
});

export const collections = { sessions, settings };
