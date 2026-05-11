#!/usr/bin/env node

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sessionsDir = path.join(__dirname, "../src/content/sessions");

// Corrected data
const correctData = [
  {
    filename: "11th-st-bar.md",
    locationName: "11th St. Bar",
    address: "510 E 11th St, New York, NY 10009",
    latitude: 40.72911,
    longitude: -73.98402,
    alerts: "Professional session — invite only.",
    startTime: "21:00",
    endTime: "23:00",
    schedule: "weekly",
    day: "sunday",
  },
  {
    filename: "an-beal-bocht-quebecois.md",
    locationName: "An Beal Bocht Cafe",
    address: "445 W 238th St, Bronx, NY 10463",
    latitude: 40.88795,
    longitude: -73.90154,
    alerts: "No alerts.",
    generalInfo: "Quebecois monthly session on the 4th Saturday, 1–4pm.",
    startTime: "13:00",
    endTime: "16:00",
    schedule: "monthly",
    day: "saturday",
  },
  {
    filename: "an-beal-bocht-sunday.md",
    locationName: "An Beal Bocht Cafe",
    address: "445 W 238th St, Bronx, NY 10463",
    latitude: 40.88795,
    longitude: -73.90154,
    alerts: "No alerts.",
    generalInfo: "Weekly Irish traditional session, Sundays 3:30–6:30pm.",
    startTime: "15:30",
    endTime: "18:30",
    schedule: "weekly",
    day: "sunday",
  },
  {
    filename: "copper-kettle.md",
    locationName: "Copper Kettle",
    address: "50-24 Skillman Ave, Woodside, NY 11377",
    latitude: 40.74415,
    longitude: -73.91353,
    alerts: "No alerts.",
    generalInfo: "Singing session, weekly Tuesday 7–10:30pm.",
    startTime: "19:00",
    endTime: "22:30",
    schedule: "weekly",
    day: "tuesday",
  },
  {
    filename: "downeys-bar.md",
    locationName: "Downey's Bar",
    address: "5790 Mosholu Ave, Bronx, NY 10471",
    latitude: 40.90801,
    longitude: -73.89665,
    alerts: "No alerts.",
    startTime: "18:00",
    endTime: "21:00",
    schedule: "weekly",
    day: "tuesday",
  },
  {
    filename: "farrells-bar.md",
    locationName: "Farrell's Bar",
    address: "215 Prospect Park West, Brooklyn, NY 11215",
    latitude: 40.65862,
    longitude: -73.98161,
    alerts: "No alerts.",
    startTime: "13:00",
    endTime: "15:00",
    schedule: "monthly",
    day: "saturday",
  },
  {
    filename: "freddys-bar.md",
    locationName: "Freddy's Bar",
    address: "627 5th Ave, Brooklyn, NY 11215",
    latitude: 40.66874,
    longitude: -73.99342,
    alerts: "No alerts.",
    startTime: "15:00",
    endTime: "18:00",
    schedule: "monthly",
    day: "sunday",
  },
  {
    filename: "graces.md",
    locationName: "Grace's",
    address: "252 W 14th St, New York, NY 10011",
    latitude: 40.73915,
    longitude: -74.00163,
    alerts: "No alerts.",
    startTime: "20:00",
    schedule: "weekly",
    day: "tuesday",
  },
  {
    filename: "hartleys.md",
    locationName: "Hartley's",
    address: "415 Putnam Ave, Brooklyn, NY 11216",
    latitude: 40.68412,
    longitude: -73.94585,
    alerts: "No alerts.",
    startTime: "20:00",
    schedule: "weekly",
    day: "monday",
  },
  {
    filename: "iona.md",
    locationName: "Iona",
    address: "180 Grand St, Brooklyn, NY 11211",
    latitude: 40.71631,
    longitude: -73.95874,
    alerts: "No alerts.",
    generalInfo: "Scottish session, weekly Monday 9pm–midnight.",
    startTime: "21:00",
    endTime: "00:00",
    schedule: "weekly",
    day: "monday",
  },
  {
    filename: "irish-arts-center.md",
    locationName: "Irish Arts Center",
    address: "726 11th Ave, New York, NY 10019",
    latitude: 40.76562,
    longitude: -73.99361,
    alerts: "No alerts.",
    generalInfo:
      "Free evening of traditional Irish music and community. Slow session (beginners welcome) 6–8pm; traditional session 8–11pm. The Devlin Café is open all night. Audience welcome at any time.",
    startTime: "18:00",
    endTime: "23:00",
    schedule: "other",
    day: "friday",
  },
  {
    filename: "lillies-victorian.md",
    locationName: "Lillie's Victorian Establishment",
    address: "13 E 17th St, New York, NY 10003",
    latitude: 40.73735,
    longitude: -73.99151,
    alerts: "No alerts.",
    startTime: "19:00",
    endTime: "21:30",
    schedule: "weekly",
    day: "monday",
  },
  {
    filename: "mary-os.md",
    locationName: "Mary O's",
    address: "32 Avenue A, New York, NY 10009",
    latitude: 40.72332,
    longitude: -73.98402,
    alerts: "$15 donation requested.",
    startTime: "20:00",
    endTime: "22:00",
    schedule: "weekly",
    day: "wednesday",
  },
  {
    filename: "mock-random-session.md",
    locationName: "Mock Random Session Lab",
    address: "123 Demo Ave, New York, NY 10010",
    latitude: 40.7412,
    longitude: -73.9896,
    alerts: "No alerts.",
    generalInfo:
      "Demo-only listing. This session simulates random days and times week to week; check social updates for the latest slot. Typical window is around early evening, with occasional late starts.",
    startTime: "17:37",
    endTime: "22:13",
    schedule: "other",
  },
  {
    filename: "ny-irish-center.md",
    locationName: "New York Irish Center",
    address: "10-40 Jackson Ave, Long Island City, NY 11101",
    latitude: 40.74441,
    longitude: -73.95122,
    alerts: "No alerts.",
    startTime: "13:30",
    endTime: "17:00",
    schedule: "weekly",
    day: "friday",
  },
  {
    filename: "paddy-reillys.md",
    locationName: "Paddy Reilly's Music Bar",
    address: "519 2nd Ave, New York, NY 10016",
    latitude: 40.74142,
    longitude: -73.97821,
    alerts: "No alerts.",
    startTime: "20:00",
    endTime: "23:00",
    schedule: "weekly",
    day: "tuesday",
  },
  {
    filename: "paddys-park-slope.md",
    locationName: "Paddy's of Park Slope",
    address: "273 13th St, Brooklyn, NY 11215",
    latitude: 40.67022,
    longitude: -73.98801,
    alerts: "No alerts.",
    startTime: "20:00",
    schedule: "monthly",
    day: "wednesday",
  },
  {
    filename: "putnams-pub.md",
    locationName: "Putnam's Pub & Cooker",
    address: "419 Myrtle Ave, Brooklyn, NY 11205",
    latitude: 40.69342,
    longitude: -73.96391,
    alerts: "No alerts.",
    startTime: "20:00",
    endTime: "23:00",
    schedule: "weekly",
    day: "tuesday",
  },
  {
    filename: "rambling-house.md",
    locationName: "Rambling House",
    address: "4292 Katonah Ave, Bronx, NY 10470",
    latitude: 40.90042,
    longitude: -73.86791,
    alerts: "Start time not confirmed — check ahead before visiting.",
    startTime: "20:00",
    schedule: "weekly",
    day: "friday",
  },
  {
    filename: "rullos.md",
    locationName: "Rullo's",
    address: "197 5th Ave, Brooklyn, NY 11217",
    latitude: 40.67642,
    longitude: -73.98061,
    alerts: "No alerts.",
    startTime: "15:00",
    endTime: "17:00",
    schedule: "monthly",
    day: "sunday",
  },
  {
    filename: "slainte-bar.md",
    locationName: "Sláinte Bar and Lounge",
    address: "304 Bowery, New York, NY 10012",
    latitude: 40.72582,
    longitude: -73.99221,
    alerts: "May be cancelled for sports events.",
    startTime: "20:00",
    endTime: "23:00",
    schedule: "weekly",
    day: "tuesday",
  },
  {
    filename: "tavern-on-mclean.md",
    locationName: "Tavern on McLean",
    address: "908 McLean Ave, Yonkers, NY 10704",
    latitude: 40.91652,
    longitude: -73.86121,
    alerts: "No alerts.",
    startTime: "16:00",
    endTime: "19:00",
    schedule: "weekly",
    day: "sunday",
  },
  {
    filename: "the-canary.md",
    locationName: "The Canary",
    address: "301 E 12th St, New York, NY 10003",
    latitude: 40.73031,
    longitude: -73.98592,
    alerts: "No alerts.",
    startTime: "20:00",
    endTime: "23:00",
    schedule: "weekly",
    day: "sunday",
  },
  {
    filename: "the-clonard.md",
    locationName: "The Clonard",
    address: "506 Grand St, Brooklyn, NY 11211",
    latitude: 40.71182,
    longitude: -73.95151,
    alerts: "No alerts.",
    startTime: "20:30",
    schedule: "weekly",
    day: "wednesday",
  },
  {
    filename: "the-landmark-tavern.md",
    locationName: "The Landmark Tavern",
    address: "626 11th Ave, New York, NY 10036",
    latitude: 40.76562,
    longitude: -73.99721,
    alerts: "No alerts.",
    startTime: "20:00",
    endTime: "22:30",
    schedule: "weekly",
    day: "monday",
  },
  {
    filename: "the-laurels.md",
    locationName: "The Laurels",
    address: "40-19 159th St, Flushing, NY 11358",
    latitude: 40.75972,
    longitude: -73.80621,
    alerts: "No alerts.",
    startTime: "19:00",
    endTime: "21:30",
    schedule: "weekly",
    day: "sunday",
  },
  {
    filename: "the-quays-pub.md",
    locationName: "The Quays Pub",
    address: "45-02 30th Ave, Astoria, NY 11103",
    latitude: 40.76342,
    longitude: -73.91261,
    alerts: "Check schedule — times vary each week.",
    startTime: "20:00",
    schedule: "weekly",
    day: "monday",
  },
  {
    filename: "the-swan.md",
    locationName: "The Swan",
    address: "301 E 12th St, New York, NY 10003",
    latitude: 40.73031,
    longitude: -73.98512,
    alerts: "No alerts.",
    startTime: "19:00",
    endTime: "21:00",
    schedule: "weekly",
    day: "tuesday",
  },
  {
    filename: "the-wheeltapper.md",
    locationName: "The Wheeltapper Pub",
    address: "141 E 44th St, New York, NY 10017",
    latitude: 40.75232,
    longitude: -73.97491,
    alerts: "No alerts.",
    startTime: "19:30",
    endTime: "22:30",
    schedule: "weekly",
    day: "tuesday",
  },
  {
    filename: "the-wicked-monk.md",
    locationName: "The Wicked Monk",
    address: "9510 3rd Ave, Brooklyn, NY 11209",
    latitude: 40.61632,
    longitude: -74.03211,
    alerts: "May have seasonal breaks — check ahead before visiting.",
    startTime: "17:00",
    endTime: "20:00",
    schedule: "weekly",
    day: "sunday",
  },
];

function generateFrontmatter(data) {
  const lines = [];
  for (const [key, value] of Object.entries(data)) {
    if (key === "filename") continue; // Skip filename field
    if (value === null || value === undefined) continue;
    let formattedValue = value;
    if (typeof value === "string") {
      formattedValue = `"${value.replace(/"/g, '\\"')}"`;
    } else if (typeof value === "boolean") {
      formattedValue = value ? "true" : "false";
    }
    lines.push(`${key}: ${formattedValue}`);
  }
  return lines.join("\n");
}

try {
  let updatedCount = 0;

  correctData.forEach((data) => {
    const filePath = path.join(sessionsDir, data.filename);

    // Generate frontmatter
    const frontmatter = generateFrontmatter(data);
    const content = `---\n${frontmatter}\ndraft: false\n---\n`;

    fs.writeFileSync(filePath, content, "utf-8");
    updatedCount++;
  });

  console.log(`✓ Updated ${updatedCount} session files`);
} catch (error) {
  console.error("Error updating sessions:", error.message);
  process.exit(1);
}
