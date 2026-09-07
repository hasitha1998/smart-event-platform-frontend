/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#12141C",
        surface: "#1B1E29",
        surface2: "#242836",
        line: "#323748",
        signal: "#F2A93B",
        pulse: "#3FD3C6",
        paper: "#EDEFF4",
        muted: "#9AA1B4",
      },
      fontFamily: {
        display: ["'Space Grotesk'", "sans-serif"],
        body: ["'Inter'", "sans-serif"],
      },
      borderRadius: {
        sm: "4px",
        md: "8px",
      },
    },
  },
  plugins: [],
};
