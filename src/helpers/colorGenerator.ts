import chroma from 'chroma-js';

// Generate unlimited distinct colors using HSL color space
export const generateDistinctColors = (count: number): string[] => {
  const colors: string[] = [];
  
  for (let i = 0; i < count; i++) {
    // Use golden ratio to distribute hues evenly around the color wheel
    const hue = (i * 137.508) % 360; // 137.508 degrees is approximately the golden angle
    
    // Vary saturation and lightness to ensure good contrast
    const saturation = 60 + (i % 20) + 20; // 60-80%
    const lightness = 40 + (i % 20) + 10;  // 40-70%
    
    const color = chroma.hsl(hue, saturation / 100, lightness / 100);
    colors.push(color.hex());
  }
  
  return colors;
};

// Generate colors for specific palettes
export const generatePaletteColors = (paletteName: string, count: number): string[] => {
  const baseColors = getBasePaletteColors(paletteName);
  
  if (count <= baseColors.length) {
    return baseColors.slice(0, count);
  }
  
  // If we need more colors, generate them based on the palette style
  const extendedColors = [...baseColors];
  
  while (extendedColors.length < count) {
    const colorIndex = extendedColors.length % baseColors.length;
    const baseColor = baseColors[colorIndex];
    
    // Generate variations of the base color
    const variation = generateColorVariation(baseColor, extendedColors.length);
    extendedColors.push(variation);
  }
  
  return extendedColors.slice(0, count);
};

// Get base colors for each palette
const getBasePaletteColors = (paletteName: string): string[] => {
  switch (paletteName) {
    case 'Professional':
      return ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4', '#84CC16', '#F97316', '#EC4899', '#6366F1'];
    case 'Pastel':
      return ['#A5B4FC', '#A7F3D0', '#FDE68A', '#FCA5A5', '#C4B5FD', '#99F6E4', '#BEF264', '#FDBA74', '#F9A8D4', '#A5B4FC'];
    case 'Vibrant':
      return ['#1E40AF', '#059669', '#D97706', '#DC2626', '#7C3AED', '#0891B2', '#65A30D', '#EA580C', '#BE185D', '#4F46E5'];
    case 'Monochrome':
      return ['#1F2937', '#374151', '#4B5563', '#6B7280', '#9CA3AF', '#D1D5DB', '#E5E7EB', '#F3F4F6', '#F9FAFB', '#FFFFFF'];
    case 'Warm':
      return ['#DC2626', '#EA580C', '#D97706', '#F59E0B', '#EAB308', '#A3E635', '#84CC16', '#65A30D', '#16A34A', '#059669'];
    case 'Cool':
      return ['#1E40AF', '#3B82F6', '#06B6D4', '#0891B2', '#0EA5E9', '#38BDF8', '#7DD3FC', '#BAE6FD', '#E0F2FE', '#F0F9FF'];
    default:
      return generateDistinctColors(10);
  }
};

// Generate color variations for palette extension
const generateColorVariation = (baseColor: string, index: number): string => {
  const color = chroma(baseColor);
  const hsl = color.hsl();
  
  // Create variations by adjusting hue, saturation, and lightness
  const hueVariation = (hsl[0] + (index * 30)) % 360;
  const saturationVariation = Math.max(20, Math.min(90, hsl[1] + (index % 3 - 1) * 10));
  const lightnessVariation = Math.max(20, Math.min(80, hsl[2] + (index % 3 - 1) * 5));
  
  return chroma.hsl(hueVariation, saturationVariation, lightnessVariation).hex();
};

// Ensure colors have sufficient contrast
export const ensureContrast = (colors: string[], minContrast: number = 3): string[] => {
  const adjustedColors = [...colors];
  
  for (let i = 1; i < adjustedColors.length; i++) {
    let attempts = 0;
    let currentColor = adjustedColors[i];
    
    while (attempts < 10) {
      // Check contrast with all previous colors
      let hasGoodContrast = true;
      
      for (let j = 0; j < i; j++) {
        const contrast = chroma.contrast(currentColor, adjustedColors[j]);
        if (contrast < minContrast) {
          hasGoodContrast = false;
          break;
        }
      }
      
      if (hasGoodContrast) {
        break;
      }
      
      // Adjust the color if contrast is insufficient
      const color = chroma(currentColor);
      const hsl = color.hsl();
      const newLightness = hsl[2] + (attempts % 2 === 0 ? 0.1 : -0.1);
      currentColor = chroma.hsl(hsl[0], hsl[1], Math.max(0.1, Math.min(0.9, newLightness))).hex();
      attempts++;
    }
    
    adjustedColors[i] = currentColor;
  }
  
  return adjustedColors;
}; 