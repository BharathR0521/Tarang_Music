/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        base: "#0F1420",       // page background — deep indigo-navy
        surface: "#171F2E",    // cards, panels
        surface2: "#1E2739",   // hover/raised surface
        amber: "#F4A94D",      // primary accent — play button, highlights
        teal: "#38BFA7",       // secondary accent — waveform, links
        ink: "#EDEFF4",        // primary text
        muted: "#8891A3",      // secondary text
      },
      fontFamily: {
        display: ["'Space Grotesk'", "sans-serif"],
        body: ["'Inter'", "sans-serif"],
      },
    },
  },
  plugins: [],
};
