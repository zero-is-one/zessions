import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const sessions = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/sessions" }),
  schema: z
    .object({
      title: z.string().min(1),
      locationName: z.string().min(1),
      address: z.string().min(1),
      latitude: z.number().optional(),
      longitude: z.number().optional(),
      timezone: z.string().default("America/New_York"),
      category: z
        .enum(["irish-session", "ceili", "concert", "workshop"])
        .default("irish-session"),
      description: z.string().optional(),
      alerts: z.string().default("No alerts."),
      generalInfo: z
        .string()
        .default("Bring your instrument and join respectfully."),
      recurrenceType: z.enum(["single", "date-list", "rrule"]),
      startDateTime: z.coerce.date().optional(),
      endDateTime: z.coerce.date().optional(),
      occurrenceDates: z.array(z.coerce.date()).default([]),
      recurrenceRule: z.string().optional(),
      recurrenceUntil: z.coerce.date().optional(),
      recurrenceCount: z.number().int().positive().optional(),
      exceptionDates: z.array(z.coerce.date()).default([]),
      draft: z.boolean().default(false),
    })
    .superRefine((value, ctx) => {
      if (value.recurrenceType === "single" && !value.startDateTime) {
        ctx.addIssue({
          code: "custom",
          message: "startDateTime is required for single recurrence.",
        });
      }
      if (
        value.recurrenceType === "date-list" &&
        value.occurrenceDates.length === 0
      ) {
        ctx.addIssue({
          code: "custom",
          message: "occurrenceDates is required for date-list recurrence.",
        });
      }
      if (
        value.recurrenceType === "rrule" &&
        (!value.recurrenceRule || !value.startDateTime)
      ) {
        ctx.addIssue({
          code: "custom",
          message:
            "recurrenceRule and startDateTime are required for rrule recurrence.",
        });
      }
    }),
});

export const collections = { sessions };
