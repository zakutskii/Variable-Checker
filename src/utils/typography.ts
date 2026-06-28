export interface TypographyProperties {
  fontFamily: string | null;
  fontWeight: number | null;
  fontSize: number | null;
  lineHeight: number | null;
  lineHeightUnit: string | null;
  letterSpacing: number | null;
  paragraphSpacing: number | null;
  paragraphIndent: number | null;
  textCase: string | null;
  textDecoration: string | null;
}

export function formatTypographyProperties(props: TypographyProperties): string {
  const parts: string[] = [];
  if (props.fontFamily) parts.push(props.fontFamily);
  if (props.fontWeight) parts.push(String(props.fontWeight));
  if (props.fontSize) parts.push(`${props.fontSize}px`);
  if (props.lineHeight) parts.push(`${props.lineHeight}${props.lineHeightUnit === "PERCENT" ? "%" : "px"}`);
  if (props.letterSpacing) parts.push(`${props.letterSpacing}px`);
  if (props.paragraphSpacing) parts.push(`PS: ${props.paragraphSpacing}px`);
  return parts.join(" / ") || "No typography";
}

export function parseFontWeight(style: string): number {
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

export function typographyPropertiesMatch(
  a: TypographyProperties,
  b: TypographyProperties,
): { matchCount: number; score: number } {
  let matching = 0;
  let total = 0;

  const compare = (aVal: unknown, bVal: unknown): boolean => {
    if (aVal === null && bVal === null) return true;
    if (aVal === null || bVal === null) return false;
    if (typeof aVal === "number" && typeof bVal === "number") {
      return Math.abs(aVal - bVal) / Math.max(Math.abs(aVal), Math.abs(bVal), 1) < 0.05;
    }
    return String(aVal).toLowerCase() === String(bVal).toLowerCase();
  };

  const props: (keyof TypographyProperties)[] = [
    "fontFamily",
    "fontWeight",
    "fontSize",
    "lineHeight",
    "letterSpacing",
    "paragraphSpacing",
  ];

  for (const prop of props) {
    total++;
    if (compare(a[prop], b[prop])) {
      matching++;
    }
  }

  const score = total > 0 ? matching / total : 0;
  return { matchCount: matching, score };
}
