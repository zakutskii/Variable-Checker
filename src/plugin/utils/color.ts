import type { FigmaColor } from "@/types";
import { formatColorValue } from "./color";

export function isSolidColor(paint: Paint): boolean {
  return paint.type === "SOLID";
}

export function isGradient(paint: Paint): boolean {
  return (
    paint.type === "GRADIENT_LINEAR" ||
    paint.type === "GRADIENT_RADIAL" ||
    paint.type === "GRADIENT_ANGULAR" ||
    paint.type === "GRADIENT_DIAMOND"
  );
}

export function getPaintColor(paint: SolidPaint): FigmaColor {
  return {
    r: paint.color.r,
    g: paint.color.g,
    b: paint.color.b,
    a: paint.opacity ?? 1,
  };
}

export function compareColorToVariable(
  color: FigmaColor,
  variableValue: VariableValue,
): boolean {
  if (typeof variableValue !== "object" || variableValue === null) return false;
  const v = variableValue as FigmaColor;
  if ("r" in v && "g" in v && "b" in v) {
    const tolerance = 0.001;
    return (
      Math.abs(color.r - v.r) < tolerance &&
      Math.abs(color.g - v.g) < tolerance &&
      Math.abs(color.b - v.b) < tolerance &&
      Math.abs((color.a ?? 1) - (v.a ?? 1)) < tolerance
    );
  }
  return false;
}
