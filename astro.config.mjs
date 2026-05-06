import { defineConfig } from "astro/config";
import react from "@astrojs/react";

const isProd = process.env.NODE_ENV === "production";

export default defineConfig({
  site: "https://zeroisone.github.io",
  base: isProd ? "/zessions" : "/",
  output: "static",
  integrations: [react()],
});
