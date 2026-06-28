import type { TypographyProperties } from "./typography";

export function extractTypographyProperties(
  node: TextNode,
): TypographyProperties {
  const fontName = node.fontName as FontName | symbol;
  const lineHeight = node.lineHeight;
  const letterSpacing = node.letterSpacing;
  const paragraphSpacing = node.paragraphSpacing;
  const paragraphIndent = node.paragraphIndent;
  const textCase = node.textCase;
  const textDecoration = node.textDecoration;

  let fontFamily: string | null = null;
  let fontWeight: number | null = null;

  if (fontName && typeof fontName === "object" && "family" in fontName) {
    fontFamily = (fontName as FontName).family;
    fontWeight = parseFontWeight((fontName as FontName).style);
  }

  return {
    fontFamily,
    fontWeight,
    fontSize: node.fontSize as number | null,
    lineHeight:
      lineHeight && lineHeight.unit !== "AUTO"
        ? "value" in lineHeight
          ? lineHeight.value
          : null
        : null,
    lineHeightUnit: lineHeight ? lineHeight.unit : null,
    letterSpacing:
      letterSpacing && letterSpacing.unit !== "NONE"
        ? "value" in letterSpacing
          ? letterSpacing.value
          : null
        : null,
    paragraphSpacing: typeof paragraphSpacing === "number" ? paragraphSpacing : null,
    paragraphIndent: typeof paragraphIndent === "number" ? paragraphIndent : null,
    textCase: textCase ?? null,
    textDecoration: textDecoration ?? null,
  };
}

function parseFontWeight(style: string): number {
  const weightMap: Record<string, number> = {
    thin: 100,
    hairline: 100,
    extralight: 200,
    ultralight: 200,
    light: 300,
    regular: 400,
    normal: 400,
    medium: 500,
    semibold: 600,
    demibold: 600,
    bold: 700,
    extrabold: 800,
    ultrabold: 800,
    black: 900,
    heavy: 900,
  };

  const lower = style.toLowerCase();
  if (weightMap[lower]) return weightMap[lower];

  const num = parseInt(style, 10);
  if (!isNaN(num)) return num;

  return 400;
}
