// fix-pages-yml.js
// Updates .pages.yml to use the current branch name for city-specific content paths
const fs = require("fs");
const { execSync } = require("child_process");

// Get current branch name
defaultBranch = "nyc";
let branch = defaultBranch;
try {
  branch = execSync("git rev-parse --abbrev-ref HEAD").toString().trim();
} catch (e) {
  console.warn('Could not determine git branch, defaulting to "nyc"');
}

const ymlPath = ".pages.yml";
let yml = fs.readFileSync(ymlPath, "utf8");

// Replace session and settings paths
const sessionRegex =
  /path:\s*src\/content\/(sessions|cities\/[^/]+\/sessions)/g;
const settingsRegex =
  /path:\s*src\/content\/(settings\/settings.md|cities\/[^/]+\/settings\/settings.md)/g;

yml = yml.replace(sessionRegex, `path: src/content/cities/${branch}/sessions`);
yml = yml.replace(
  settingsRegex,
  `path: src/content/cities/${branch}/settings/settings.md`,
);

fs.writeFileSync(ymlPath, yml, "utf8");
console.log(`.pages.yml updated for city branch: ${branch}`);
