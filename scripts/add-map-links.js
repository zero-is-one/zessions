#!/usr/bin/env node

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sessionsDir = path.join(__dirname, "../src/content/sessions");

const mapData = [
  {
    filename: "11th-st-bar.md",
    mapLink: "https://www.google.com/maps/search/?api=1&query=11th+St+Bar+NYC",
  },
  {
    filename: "an-beal-bocht-quebecois.md",
    mapLink:
      "https://www.google.com/maps/search/?api=1&query=An+Beal+Bocht+Cafe+Bronx",
  },
  {
    filename: "an-beal-bocht-sunday.md",
    mapLink:
      "https://www.google.com/maps/search/?api=1&query=An+Beal+Bocht+Cafe+Bronx",
  },
  {
    filename: "copper-kettle.md",
    mapLink:
      "https://www.google.com/maps/search/?api=1&query=Copper+Kettle+Woodside+NY",
  },
  {
    filename: "downeys-bar.md",
    mapLink:
      "https://www.google.com/maps/search/?api=1&query=Downeys+Bar+Bronx",
  },
  {
    filename: "farrells-bar.md",
    mapLink:
      "https://www.google.com/maps/search/?api=1&query=Farrells+Bar+Brooklyn",
  },
  {
    filename: "freddys-bar.md",
    mapLink:
      "https://www.google.com/maps/search/?api=1&query=Freddys+Bar+Brooklyn",
  },
  {
    filename: "graces.md",
    mapLink:
      "https://www.google.com/maps/search/?api=1&query=Graces+Bar+NYC+14th+St",
  },
  {
    filename: "hartleys.md",
    mapLink:
      "https://www.google.com/maps/search/?api=1&query=Hartleys+Brooklyn",
  },
  {
    filename: "iona.md",
    mapLink: "https://www.google.com/maps/search/?api=1&query=Iona+Brooklyn",
  },
  {
    filename: "irish-arts-center.md",
    mapLink:
      "https://www.google.com/maps/search/?api=1&query=Irish+Arts+Center+NYC",
  },
  {
    filename: "lillies-victorian.md",
    mapLink:
      "https://www.google.com/maps/search/?api=1&query=Lillies+Victorian+Union+Square",
  },
  {
    filename: "mary-os.md",
    mapLink: "https://www.google.com/maps/search/?api=1&query=Mary+Os+NYC",
  },
  {
    filename: "mock-random-session.md",
    mapLink:
      "https://www.google.com/maps/search/?api=1&query=Mock+Random+Session+Lab+NYC",
  },
  {
    filename: "ny-irish-center.md",
    mapLink:
      "https://www.google.com/maps/search/?api=1&query=New+York+Irish+Center+LIC",
  },
  {
    filename: "paddy-reillys.md",
    mapLink:
      "https://www.google.com/maps/search/?api=1&query=Paddy+Reillys+NYC",
  },
  {
    filename: "paddys-park-slope.md",
    mapLink:
      "https://www.google.com/maps/search/?api=1&query=Paddys+of+Park+Slope",
  },
  {
    filename: "putnams-pub.md",
    mapLink:
      "https://www.google.com/maps/search/?api=1&query=Putnams+Pub+Brooklyn",
  },
  {
    filename: "rambling-house.md",
    mapLink:
      "https://www.google.com/maps/search/?api=1&query=Rambling+House+Bronx",
  },
  {
    filename: "rullos.md",
    mapLink: "https://www.google.com/maps/search/?api=1&query=Rullos+Brooklyn",
  },
  {
    filename: "slainte-bar.md",
    mapLink: "https://www.google.com/maps/search/?api=1&query=Slainte+Bar+NYC",
  },
  {
    filename: "tavern-on-mclean.md",
    mapLink:
      "https://www.google.com/maps/search/?api=1&query=Tavern+on+McLean+Yonkers",
  },
  {
    filename: "the-canary.md",
    mapLink: "https://www.google.com/maps/search/?api=1&query=The+Canary+NYC",
  },
  {
    filename: "the-clonard.md",
    mapLink:
      "https://www.google.com/maps/search/?api=1&query=The+Clonard+Brooklyn",
  },
  {
    filename: "the-landmark-tavern.md",
    mapLink:
      "https://www.google.com/maps/search/?api=1&query=The+Landmark+Tavern+NYC",
  },
  {
    filename: "the-laurels.md",
    mapLink:
      "https://www.google.com/maps/search/?api=1&query=The+Laurels+Flushing+NY",
  },
  {
    filename: "the-quays-pub.md",
    mapLink:
      "https://www.google.com/maps/search/?api=1&query=The+Quays+Pub+Astoria",
  },
  {
    filename: "the-swan.md",
    mapLink:
      "https://www.google.com/maps/search/?api=1&query=The+Swan+NYC+12th+St",
  },
  {
    filename: "the-wheeltapper.md",
    mapLink:
      "https://www.google.com/maps/search/?api=1&query=The+Wheeltapper+Pub+NYC",
  },
  {
    filename: "the-wicked-monk.md",
    mapLink:
      "https://www.google.com/maps/search/?api=1&query=The+Wicked+Monk+Brooklyn",
  },
];

try {
  let updatedCount = 0;

  mapData.forEach((data) => {
    const filePath = path.join(sessionsDir, data.filename);
    const content = fs.readFileSync(filePath, "utf-8");

    // Split into frontmatter and body
    const match = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
    if (!match) {
      console.warn(`⚠ Could not parse frontmatter in ${data.filename}`);
      return;
    }

    const [, frontmatterStr, body] = match;
    const frontmatterLines = frontmatterStr.split("\n");

    // Insert googleMapsLink after address
    const newLines = [];
    let inserted = false;
    for (const line of frontmatterLines) {
      newLines.push(line);
      if (!inserted && line.startsWith("address:")) {
        newLines.push(`googleMapsLink: "${data.mapLink}"`);
        inserted = true;
      }
    }

    const newFrontmatter = newLines.join("\n");
    const newContent = `---\n${newFrontmatter}\n---\n${body}`;

    fs.writeFileSync(filePath, newContent, "utf-8");
    updatedCount++;
  });

  console.log(`✓ Added googleMapsLink to ${updatedCount} session files`);
} catch (error) {
  console.error("Error updating sessions:", error.message);
  process.exit(1);
}
