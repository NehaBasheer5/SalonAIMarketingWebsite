import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
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
        display: ["var(--font-playfair)", "Georgia", "serif"],
        sans: ["var(--font-dm-sans)", "ui-sans-serif", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
