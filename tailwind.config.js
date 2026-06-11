// tailwind.config.js
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class", // enable dark mode via class
  theme: {
    extend: {
      colors: {
        primary: "#ffb703", // vibrant gold
        secondary: "#002855", // deep navy
        accent: "#0066ff", // bright blue for calls to action
        background: "#f5f5f5",
        surface: "#ffffff",
        muted: "#e2e8f0",
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui"],
        mono: ["Roboto Mono", "ui-monospace", "SFMono-Regular"],
      },
      borderRadius: {
        xl: "1rem",
      },
    },
  },
  plugins: [],
};
