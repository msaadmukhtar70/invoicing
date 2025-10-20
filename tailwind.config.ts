import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brix: {
          blue: "#FF5722",
          "blue-600": "#F4471F",
          "blue-700": "#D03819",
          ink: "#0F172A",
          muted: "#FFEDE6",
        }
      },
      boxShadow: {
        brix: "0 10px 30px rgba(255,87,34,0.18)",
      },
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.25rem",
      }
    },
  },
  plugins: [],
};
export default config;
