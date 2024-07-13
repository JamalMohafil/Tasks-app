import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  
  theme: {
    extend: {
      fontFamily: {
        arabic: "din-next-arabic",
      },
      backgroundColor: {
        primary:"#202020",
        accentBg:"black"
      },
      colors: {
        accent: "#8746fb",
        accentHover: "#5e20ce",
      },
    },
  },
  plugins: [],
};
export default config;
