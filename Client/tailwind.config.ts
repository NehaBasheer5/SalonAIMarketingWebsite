import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      screens: {
        desktop: "1440px",
      },
      colors: {
        salon: {
          bg: "#fcfaf7",
          soft: "#f5f0e9",
          ink: "#1a1a1a",
          muted: "#6b6560",
          gold: "#a68b67",
          "gold-soft": "#c4a882",
          border: "#e8e0d5",
          accent: "#91663f",
          brand: "#85592f",
          "brand-dark": "#6f4929",
          deep: "#60472f",
          eyebrow: "#7f6448",
          rule: "#a98a65",
          tile: "#efe2d4",
          card: "#eadfce",
          shell: "#f3ebe2",
          "shell-soft": "#f8f1ea",
          chip: "#f1e9df",
        },
      },
      fontFamily: {
        display: ["var(--font-manrope)", "ui-sans-serif", "system-ui", "sans-serif"],
        hero: ["var(--font-manrope)", "ui-sans-serif", "system-ui", "sans-serif"],
        sans: ["var(--font-dm-sans)", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      fontSize: {
        xs: ["0.8125rem", { lineHeight: "1.125rem" }],
        sm: ["0.9375rem", { lineHeight: "1.375rem" }],
        base: ["1.0625rem", { lineHeight: "1.625rem" }],
        lg: ["1.1875rem", { lineHeight: "1.875rem" }],
      },
    },
  },
  plugins: [],
};
export default config;
