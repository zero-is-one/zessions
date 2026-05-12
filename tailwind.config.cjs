/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        parchment: "#f4efe4",
        peat: "#1f3026",
        lichen: "#6f8f72",
        ember: "#b65c3a",
        harbor: "#2f5f7a",
      },
      fontFamily: {
        display: ["Lora", "Georgia", "serif"],
        body: ['"Work Sans"', '"Segoe UI"', "sans-serif"],
      },
      boxShadow: {
        soft: "0 20px 45px -28px rgba(31, 48, 38, 0.45)",
      },
      keyframes: {
        rise: {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        rise: "rise 520ms ease-out both",
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
