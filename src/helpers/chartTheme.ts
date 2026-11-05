// Chart.js draws on a canvas, which can't read CSS variables, so its default text
// and grid colors are switched here whenever the theme changes. Charts that set
// explicit colors keep them; everything relying on defaults follows the theme.
const LIGHT_CHART_DEFAULTS = { color: '#666', borderColor: 'rgba(0,0,0,0.1)' };
const DARK_CHART_DEFAULTS = { color: '#B4BBC6', borderColor: 'rgba(255,255,255,0.1)' };

let hasLoadedChart = false;

export const syncChartTheme = async (isDark: boolean) => {
  // Light defaults are Chart.js's own, so light users never download the library here.
  if (!isDark && !hasLoadedChart) return;

  const { Chart } = await import('chart.js');
  hasLoadedChart = true;

  const defaults = isDark ? DARK_CHART_DEFAULTS : LIGHT_CHART_DEFAULTS;
  Chart.defaults.color = defaults.color;
  Chart.defaults.borderColor = defaults.borderColor;
  Object.values(Chart.instances).forEach((chart) => chart.update('none'));
};
