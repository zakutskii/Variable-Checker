import type { FigmaColor } from "@/types";

export function rgbaToHex(r: number, g: number, b: number, a: number = 1): string {
  const toHex = (n: number): string => {
    const clamped = Math.round(Math.max(0, Math.min(255, n * 255)));
    return clamped.toString(16).padStart(2, "0");
  };
  const hex = `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  if (a < 1) {
    return hex + toHex(a);
  }
  return hex;
}

export function hexToRgba(hex: string): FigmaColor {
  const clean = hex.replace("#", "");
  let r: number, g: number, b: number, a: number = 1;

  if (clean.length === 3) {
    r = parseInt(clean[0]! + clean[0], 16) / 255;
    g = parseInt(clean[1]! + clean[1], 16) / 255;
    b = parseInt(clean[2]! + clean[2], 16) / 255;
  } else if (clean.length === 6) {
    r = parseInt(clean.substring(0, 2), 16) / 255;
    g = parseInt(clean.substring(2, 4), 16) / 255;
    b = parseInt(clean.substring(4, 6), 16) / 255;
  } else if (clean.length === 8) {
    r = parseInt(clean.substring(0, 2), 16) / 255;
    g = parseInt(clean.substring(2, 4), 16) / 255;
    b = parseInt(clean.substring(4, 6), 16) / 255;
    a = parseInt(clean.substring(6, 8), 16) / 255;
  } else {
    return { r: 0, g: 0, b: 0, a: 1 };
  }

  return { r, g, b, a };
}

export function formatColorValue(color: FigmaColor): string {
  if (color.a < 1) {
    return `rgba(${Math.round(color.r * 255)}, ${Math.round(color.g * 255)}, ${Math.round(color.b * 255)}, ${color.a.toFixed(2)})`;
  }
  return rgbaToHex(color.r, color.g, color.b, color.a);
}

export function colorDistance(a: FigmaColor, b: FigmaColor): number {
  const dr = a.r - b.r;
  const dg = a.g - b.g;
  const db = a.b - b.b;
  const da = a.a - b.a;
  return Math.sqrt(dr * dr + dg * dg + db * db + da * da);
}

export function colorSimilarity(a: FigmaColor, b: FigmaColor): number {
  return 1 - Math.min(1, colorDistance(a, b) / Math.SQRT2);
}

export function isColorEqual(a: FigmaColor, b: FigmaColor): boolean {
  const tolerance = 0.001;
  return (
    Math.abs(a.r - b.r) < tolerance &&
    Math.abs(a.g - b.g) < tolerance &&
    Math.abs(a.b - b.b) < tolerance &&
    Math.abs(a.a - b.a) < tolerance
  );
}
