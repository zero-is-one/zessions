import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import react from "@astrojs/react";

const isProd = process.env.NODE_ENV === "production";

export default defineConfig({
  site: "https://zero-is-one.github.io",
  base: isProd ? "/find-a-session" : "/",
  output: "static",
  integrations: [react(), mdx()],
});
