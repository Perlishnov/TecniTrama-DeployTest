import {heroui} from "@heroui/theme"

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/layouts/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "rojo-intec-50": "#FDE8E8",
        "rojo-intec-100": "#FFEAE6",
        "rojo-intec-200": "#FFD7CF",
        "rojo-intec-300": "#FFC2B8",
        "rojo-intec-400": "#FF9A8C",
        "Gris-100": "#EFF0F0",
        "Gris-500": "#63666A",
      },
      fontFamily: {
        barlow: ["Barlow", "sans-serif"],
      },
      fontWeight: {
        "barlow": "400",
        "barlow-bold": "700",
        "barlow-medium": "500",
      },
    },
  },
  darkMode: "class",
  plugins: [heroui()],
};
