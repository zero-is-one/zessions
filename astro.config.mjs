import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import react from "@astrojs/react";

import cloudflare from "@astrojs/cloudflare";

export default defineConfig({
  site: "https://findasessionnyc.com",
  base: "/",
  output: "static",
  integrations: [react(), mdx()],
  adapter: cloudflare(),
});