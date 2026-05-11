import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const sessions = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/sessions" }),
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

export const collections = { sessions };
