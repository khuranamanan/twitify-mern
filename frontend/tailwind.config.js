import colors from "tailwindcss/colors";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    colors: {
      ...colors,
      cyan: "#3fc1c9",
      snow: "#f5f5f5",
      black: "#000000",
      aqua: "#67ced4",
      teal: "#2f9fa6",
      white: "#ffffff",
      gray: "#dddddd",
      lightGray: "#f1f1f1",
      darkGray: "#999999",
      offWhite: "#f9f9f9",
      darkerGray: "#2a2a2a",
      transparentWhite: "hsla(0,0%,100%,0.1)",
      transparentWhite2: "hsla(0,0%,100%,0.15)",
      transparentBlack: "hsla(0,0%,0%, 0.8)",
      transparentBlack2: "hsla(0,0%,0%, 0.1)",
    },
    fontFamily: {
      inter: ["Inter", "sans-serif"],
      openSans: ["Open Sans", "sans-serif"],
    },
    extend: {},
  },
  plugins: [],
};
