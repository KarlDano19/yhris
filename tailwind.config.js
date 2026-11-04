/** @type {import('tailwindcss').Config} */
const colors = require("tailwindcss/colors");
delete colors["lightBlue"];
delete colors["warmGray"];
delete colors["trueGray"];
delete colors["coolGray"];
delete colors["blueGray"];
const { surfaceColors, textColors, themePalettePlugin } = require("./tailwind.theme");
module.exports = {
  darkMode: 'class',
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
    "./src/app/**/*.{js,ts,jsx,tsx}",
    "./src/components/pages/(auth)/**/*.{js,ts,jsx,tsx}",
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
        // Palette, brand and `hris-*` colors resolve to CSS variables so they
        // switch with dark mode. See tailwind.theme.js.
        ...surfaceColors,
        // Semantic theme tokens — auto-switch with dark mode via CSS variables.
        // Usage: bg-theme-bg, text-theme-body, border-theme-border, etc.
        theme: {
          bg:             'var(--color-bg)',
          surface:        'var(--color-surface)',
          'surface-raised': 'var(--color-surface-raised)',
          body:           'var(--color-text)',
          muted:          'var(--color-text-muted)',
          border:         'var(--color-border)',
          'border-subtle':'var(--color-border-subtle)',
          primary:        'var(--color-primary)',
          'primary-yellow': 'var(--color-primary-yellow)',
          success:        'var(--color-success)',
          error:          'var(--color-error)',
          warning:        'var(--color-warning)',
        },
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
      // Tailwind can't derive the default focus ring from a CSS variable, so pin its original value.
      ringColor: { DEFAULT: "#3b82f6" },
      // Foreground utilities use the text role of the palette (lighter shades in dark mode).
      textColor: textColors,
      placeholderColor: textColors,
      caretColor: textColors,
      textDecorationColor: textColors,
      fill: textColors,
      stroke: textColors,
    },
  },
  safelist: [
    'text-red-600',
    'border-red-600',
  ],
  plugins: [themePalettePlugin],
};
