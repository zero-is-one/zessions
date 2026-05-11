#!/usr/bin/env node

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sessionsDir = path.join(__dirname, "../src/content/sessions");
const outputFile = path.join(__dirname, "../sessions-combined.json");

function parseFrontmatter(content) {
  // Remove BOM if present
  content = content.replace(/^\uFEFF/, "");

  // Split by first --- to get frontmatter and body
  const parts = content.split(/^---\s*$/m);

  if (parts.length < 3) {
    return { frontmatter: {}, body: content };
  }

  const frontmatterStr = parts[1];
  const body = parts.slice(2).join("---").trim();
  const frontmatter = {};

  // Parse YAML-like frontmatter line by line
  frontmatterStr.split(/\r?\n/).forEach((line) => {
    line = line.trim();
    if (!line) return;

    const colonIndex = line.indexOf(":");
    if (colonIndex === -1) return;

    const key = line.substring(0, colonIndex).trim();
    let value = line.substring(colonIndex + 1).trim();

    // Remove quotes if present
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    // Parse boolean
    if (value === "true") value = true;
    if (value === "false") value = false;

    // Try to parse as number
    if (!isNaN(value) && value !== "") {
      value = parseFloat(value);
    }

    frontmatter[key] = value;
  });

  return { frontmatter, body };
}

try {
  const files = fs.readdirSync(sessionsDir).filter((f) => f.endsWith(".md"));
  const sessions = [];

  files.forEach((file) => {
    const filePath = path.join(sessionsDir, file);
    const content = fs.readFileSync(filePath, "utf-8");
    const { frontmatter, body } = parseFrontmatter(content);

    sessions.push({
      filename: file,
      ...frontmatter,
      body: body,
    });
  });

  // Sort by title or location name
  sessions.sort((a, b) => {
    const nameA = (a.title || a.locationName || "").toLowerCase();
    const nameB = (b.title || b.locationName || "").toLowerCase();
    return nameA.localeCompare(nameB);
  });

  fs.writeFileSync(outputFile, JSON.stringify(sessions, null, 2));

  console.log(`✓ Combined ${sessions.length} sessions into ${outputFile}`);
} catch (error) {
  console.error("Error combining sessions:", error.message);
  process.exit(1);
}
