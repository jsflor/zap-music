/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        apple: {
          red: "#FA233B",
          "red-dark": "#FA2D48",
          "red-hover": "#e01c34",
          sidebar: "rgba(32, 32, 35, 0.78)",
          content: "#181819",
          lcd: "rgba(42, 42, 46, 0.72)",
          "lcd-border": "rgba(255, 255, 255, 0.08)",
          border: "rgba(255, 255, 255, 0.07)",
          hover: "rgba(255, 255, 255, 0.05)",
          active: "rgba(255, 255, 255, 0.09)",
          text: "#f5f5f7",
          "text-muted": "rgba(235, 235, 245, 0.65)",
          "text-subtle": "rgba(235, 235, 245, 0.4)",
        },
      },
      fontFamily: {
        sans: [
          "-apple-system",
          "BlinkMacSystemFont",
          "SF Pro Text",
          "SF Pro Display",
          "system-ui",
          "sans-serif",
        ],
      },
      boxShadow: {
        artwork: "0 4px 14px rgba(0, 0, 0, 0.4)",
        "artwork-lg": "0 10px 30px rgba(0, 0, 0, 0.5)",
        lcd: "inset 0 1px 1px rgba(255, 255, 255, 0.06), 0 2px 8px rgba(0, 0, 0, 0.2)",
      },
    },
  },
  plugins: [],
};
