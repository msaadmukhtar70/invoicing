export const popularBrandColors = [
  "#FF5722",
  "#FB8C00",
  "#FBC02D",
  "#8BC34A",
  "#009688",
  "#00BCD4",
  "#3F51B5",
  "#9C27B0",
] as const;

export const defaultBrandColor = popularBrandColors[0];
export const NO_BRAND_COLOR = "__NO_BRAND_COLOR__";

type RGB = { r: number; g: number; b: number };

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

const hexToRgb = (hex: string): RGB | null => {
  const normalized = hex.replace("#", "");
  if (normalized.length !== 6) return null;
  const r = parseInt(normalized.slice(0, 2), 16);
  const g = parseInt(normalized.slice(2, 4), 16);
  const b = parseInt(normalized.slice(4, 6), 16);
  if ([r, g, b].some((value) => Number.isNaN(value))) {
    return null;
  }
  return { r, g, b };
};

const rgbToHex = ({ r, g, b }: RGB): string => {
  const toHex = (value: number) => clamp(Math.round(value), 0, 255).toString(16).padStart(2, "0");
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
};

export const mixHexColors = (color: string, mixWith: string, ratio: number): string => {
  const baseRgb = hexToRgb(color);
  const mixRgb = hexToRgb(mixWith);
  if (!baseRgb || !mixRgb) return color;
  const clampedRatio = clamp(ratio, 0, 1);
  return rgbToHex({
    r: baseRgb.r * (1 - clampedRatio) + mixRgb.r * clampedRatio,
    g: baseRgb.g * (1 - clampedRatio) + mixRgb.g * clampedRatio,
    b: baseRgb.b * (1 - clampedRatio) + mixRgb.b * clampedRatio,
  });
};

export const hexToRgba = (hex: string, alpha = 1): string => {
  const rgb = hexToRgb(hex);
  if (!rgb) return `rgba(0,0,0,${clamp(alpha, 0, 1)})`;
  const a = clamp(alpha, 0, 1);
  return `rgba(${Math.round(rgb.r)}, ${Math.round(rgb.g)}, ${Math.round(rgb.b)}, ${a})`;
};
