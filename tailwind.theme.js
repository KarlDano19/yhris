/**
 * Universal light/dark palette for Tailwind.
 *
 * Every palette color resolves to a CSS variable instead of a fixed hex, so a
 * class like `bg-gray-50` or `text-red-700` flips with the theme without any
 * per-component `dark:` classes or override CSS.
 *
 * - Light values are Tailwind's own defaults, so light mode renders exactly as before.
 * - `html.dark` swaps the values. `[data-theme="light"]` restores light values for a
 *   subtree (paper previews, export captures), and print always uses light values.
 *
 * Colors have two roles because one hex can't serve both in dark mode:
 *   --c-*  surfaces: background, border, ring, divide, outline, gradient, shadow
 *   --t-*  foreground: text, placeholder, fill, stroke, caret, decoration
 * e.g. `bg-blue-600 text-white` buttons stay solid while `text-blue-600` links lighten.
 */
const plugin = require('tailwindcss/plugin');
const colors = require('tailwindcss/colors');

const SHADES = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];
const NEUTRALS = ['slate', 'gray', 'zinc', 'neutral', 'stone'];
const CHROMATIC = [
  'red', 'orange', 'amber', 'yellow', 'lime', 'green', 'emerald', 'teal', 'cyan',
  'sky', 'blue', 'indigo', 'violet', 'purple', 'fuchsia', 'pink', 'rose',
];
const DARK_PAGE = '#0F1419';

const toRgb = (hex) => {
  let h = hex.replace('#', '');
  if (h.length === 3) h = h.split('').map((c) => c + c).join('');
  return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16));
};
const channels = (hex) => toRgb(hex).join(' ');
// Blend `hex` over the dark page color at the given strength (0–1).
const tint = (hex, amount) => {
  const fg = toRgb(hex);
  const bg = toRgb(DARK_PAGE);
  return fg.map((c, i) => Math.round(bg[i] + (c - bg[i]) * amount)).join(' ');
};

// Neutral scales: light tints become dark surfaces, dark text shades become light.
const NEUTRAL_DARK_SURFACE = { 50: '#161B22', 100: '#222831', 200: '#2C333D', 300: '#3A424E', 400: '#4B5563' };
const NEUTRAL_DARK_TEXT = { 500: '#A3ABB7', 600: '#B4BBC6', 700: '#D1D5DB', 800: '#E1E4E8', 900: '#E8EAED', 950: '#F9FAFB' };

// Chromatic scales: pale tints become soft washes, dark text shades step lighter.
const CHROMATIC_DARK_SURFACE = { 50: 0.1, 100: 0.16, 200: 0.24, 300: 0.38 };
const CHROMATIC_DARK_TEXT = { 500: 400, 600: 400, 700: 300, 800: 200, 900: 200, 950: 100 };

// HRIS brand colors. The `hris-*` names replace hex values that were written inline.
const BRAND = {
  'savoy-blue':    { light: '#355FD0', darkSurface: '#355FD0', darkText: '#7C9CFF' },
  'indigo-dye':    { light: '#2C3F58', darkSurface: '#2C3F58', darkText: '#D5DEEA' },
  'hris-line':     { light: '#ACB9CB', darkSurface: '#3A4452', darkText: '#8D9AAD' },
  'hris-line-alt': { light: '#A8B5C7', darkSurface: '#3A4452', darkText: '#8D9AAD' },
  'hris-tint':     { light: '#EBF3FF', darkSurface: null, darkText: '#EBF3FF' },
  'hris-yellow':   { light: '#FFC107', darkSurface: '#FFC107', darkText: '#FFC94A' },
};

const buildVariables = () => {
  const light = {};
  const dark = {};

  NEUTRALS.forEach((family) => {
    SHADES.forEach((shade) => {
      const hex = colors[family][shade];
      light[`--c-${family}-${shade}`] = channels(hex);
      light[`--t-${family}-${shade}`] = channels(hex);
      dark[`--c-${family}-${shade}`] = channels(NEUTRAL_DARK_SURFACE[shade] || hex);
      dark[`--t-${family}-${shade}`] = channels(NEUTRAL_DARK_TEXT[shade] || hex);
    });
  });

  CHROMATIC.forEach((family) => {
    SHADES.forEach((shade) => {
      const hex = colors[family][shade];
      const surfaceAmount = CHROMATIC_DARK_SURFACE[shade];
      const textShade = CHROMATIC_DARK_TEXT[shade];
      light[`--c-${family}-${shade}`] = channels(hex);
      light[`--t-${family}-${shade}`] = channels(hex);
      dark[`--c-${family}-${shade}`] = surfaceAmount ? tint(colors[family][400], surfaceAmount) : channels(hex);
      dark[`--t-${family}-${shade}`] = channels(textShade ? colors[family][textShade] : hex);
    });
  });

  Object.entries(BRAND).forEach(([name, { light: hex, darkSurface, darkText }]) => {
    light[`--c-${name}`] = channels(hex);
    light[`--t-${name}`] = channels(hex);
    dark[`--c-${name}`] = darkSurface ? channels(darkSurface) : tint(colors.blue[400], 0.12);
    dark[`--t-${name}`] = channels(darkText);
  });

  // White surfaces become cards; black text becomes body text.
  light['--c-white'] = channels('#FFFFFF');
  light['--t-black'] = channels('#000000');
  dark['--c-white'] = channels('#1A1F26');
  dark['--t-black'] = channels('#E8EAED');

  return { light, dark };
};

const ref = (name) => `rgb(var(--${name}) / <alpha-value>)`;

const buildRole = (prefix) => {
  const palette = {};
  [...NEUTRALS, ...CHROMATIC].forEach((family) => {
    palette[family] = {};
    SHADES.forEach((shade) => {
      palette[family][shade] = ref(`${prefix}-${family}-${shade}`);
    });
  });
  Object.keys(BRAND).forEach((name) => {
    palette[name] = ref(`${prefix}-${name}`);
  });
  return palette;
};

const surfaceColors = { ...buildRole('c'), white: ref('c-white'), black: '#000000' };
const textColors = { ...buildRole('t'), white: '#FFFFFF', black: ref('t-black') };

const { light, dark } = buildVariables();

const themePalettePlugin = plugin(({ addBase }) => {
  addBase({
    ':root, [data-theme="light"]': { ...light, colorScheme: 'light' },
    'html.dark': { ...dark, colorScheme: 'dark' },
    'html.dark [data-theme="light"]': { ...light, colorScheme: 'light', color: '#000000' },
    '@media print': {
      'html.dark': { ...light, colorScheme: 'light' },
    },
  });
});

module.exports = { surfaceColors, textColors, themePalettePlugin };
