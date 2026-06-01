/** @type {import('tailwindcss').Config} */
const colors = require("tailwindcss/colors");
delete colors["lightBlue"];
delete colors["warmGray"];
delete colors["trueGray"];
delete colors["coolGray"];
delete colors["blueGray"];
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
    "./src/app/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      boxShadow: {
        'custom': '-10px 0px 25px rgba(39, 87, 237, 0.08)'
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        ...colors,
        "indigo-dye": "#2C3F58",
        "savoy-blue": "#355FD0",
        // Landing page design system
        navy: "hsl(var(--lp-navy))",
        "lp-blue": "hsl(var(--lp-blue))",
        warm: "hsl(var(--lp-warm-bg))",
        primary: {
          DEFAULT: "hsl(var(--lp-primary))",
          foreground: "hsl(var(--lp-primary-foreground))",
        },
        "lp-muted": {
          DEFAULT: "hsl(var(--lp-muted))",
          foreground: "hsl(var(--lp-muted-foreground))",
        },
        "lp-card": "hsl(var(--lp-card))",
        "lp-border": "hsl(var(--lp-border))",
      },
      width: {
        94: "22.2rem",
      },
      borderRadius: {
        lp: "0.625rem",
      },
    },
  },
  plugins: [],
};
