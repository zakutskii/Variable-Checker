import type { StyleInfo, FigmaColor } from "@/types";
import { rgbaToHex, isColorEqual } from "@/utils/color";

export class StyleResolver {
  private cache: Map<string, StyleInfo[]> = new Map();
  private allStyles: StyleInfo[] = [];
  private initialized = false;

  async initialize(): Promise<void> {
    if (this.initialized) return;

    try {
      const localStyles = this.collectLocalStyles();
      const libraryStyles = await this.collectLibraryStyles();
      this.allStyles = [...localStyles, ...libraryStyles];
      this.buildCache();
      this.initialized = true;
    } catch (error) {
      console.error("Failed to initialize StyleResolver:", error);
      throw error;
    }
  }

  private collectLocalStyles(): StyleInfo[] {
    const styles: StyleInfo[] = [];
    const styleTypes: ("FILL" | "TEXT" | "EFFECT")[] = ["FILL", "TEXT", "EFFECT"];

    for (const styleType of styleTypes) {
      const figmaStyles = figma.getLocalPaintStyles
        ? figma.getLocalPaintStyles()
        : [];
      const textStyles = figma.getLocalTextStyles
        ? figma.getLocalTextStyles()
        : [];
      const effectStyles = figma.getLocalEffectStyles
        ? figma.getLocalEffectStyles()
        : [];

      let targetStyles: BaseStyle[] = [];
      if (styleType === "FILL") targetStyles = figma.getLocalPaintStyles();
      else if (styleType === "TEXT") targetStyles = figma.getLocalTextStyles();
      else if (styleType === "EFFECT") targetStyles = figma.getLocalEffectStyles();

      for (const style of targetStyles) {
        styles.push({
          id: style.id,
          name: style.name,
          type: styleType,
          source: "local",
          remote: false,
          key: (style as unknown as { key: string }).key ?? style.id,
          description: style.description,
        });
      }
    }

    return styles;
  }

  private async collectLibraryStyles(): Promise<StyleInfo[]> {
    const styles: StyleInfo[] = [];

    try {
      const libraries = await figma.teamLibrary?.getStylesAsync();
      if (!libraries) return styles;

      for (const libraryStyle of libraries) {
        styles.push({
          id: libraryStyle.id,
          name: libraryStyle.name,
          type: libraryStyle.styleType as "FILL" | "TEXT" | "EFFECT",
          source: "library",
          libraryName: libraryStyle.libraryName,
          remote: true,
          key: libraryStyle.key,
          description: libraryStyle.description,
        });
      }
    } catch {
      console.warn("Could not access team library styles");
    }

    return styles;
  }

  private buildCache(): void {
    this.cache.clear();

    for (const style of this.allStyles) {
      const key = style.type;

      const existing = this.cache.get(key) ?? [];
      existing.push(style);
      this.cache.set(key, existing);
    }
  }

  getStyles(): StyleInfo[] {
    return this.allStyles;
  }

  getColorStyles(): StyleInfo[] {
    return this.allStyles.filter((s) => s.type === "FILL");
  }

  getTextStyles(): StyleInfo[] {
    return this.allStyles.filter((s) => s.type === "TEXT");
  }

  getEffectStyles(): StyleInfo[] {
    return this.allStyles.filter((s) => s.type === "EFFECT");
  }

  getLocalStyles(): StyleInfo[] {
    return this.allStyles.filter((s) => s.source === "local");
  }

  getLibraryStyles(): StyleInfo[] {
    return this.allStyles.filter((s) => s.source === "library");
  }

  findExactColorMatch(color: FigmaColor): StyleInfo | undefined {
    const colorStyles = this.getColorStyles();

    for (const style of colorStyles) {
      try {
        const paintStyle = figma.getStyleById(style.id) as PaintStyle | null;
        if (!paintStyle) continue;

        const paints = paintStyle.paints;
        if (paints.length === 0) continue;

        const firstPaint = paints[0];
        if (firstPaint.type !== "SOLID") continue;

        const solidPaint = firstPaint as SolidPaint;
        if (
          isColorEqual(color, {
            r: solidPaint.color.r,
            g: solidPaint.color.g,
            b: solidPaint.color.b,
            a: solidPaint.opacity ?? 1,
          })
        ) {
          return style;
        }
      } catch {
        continue;
      }
    }

    return undefined;
  }

  findSimilarColorStyle(
    color: FigmaColor,
    threshold: number = 0.95,
  ): StyleInfo[] {
    const colorStyles = this.getColorStyles();
    const results: { style: StyleInfo; distance: number }[] = [];

    for (const style of colorStyles) {
      try {
        const paintStyle = figma.getStyleById(style.id) as PaintStyle | null;
        if (!paintStyle) continue;

        const paints = paintStyle.paints;
        if (paints.length === 0) continue;

        const firstPaint = paints[0];
        if (firstPaint.type !== "SOLID") continue;

        const solidPaint = firstPaint as SolidPaint;
        const dr = color.r - solidPaint.color.r;
        const dg = color.g - solidPaint.color.g;
        const db = color.b - solidPaint.color.b;
        const da = (color.a ?? 1) - (solidPaint.opacity ?? 1);
        const distance = Math.sqrt(dr * dr + dg * dg + db * db + da * da);
        const similarity = 1 - Math.min(1, distance / Math.SQRT2);

        if (similarity >= threshold) {
          results.push({ style, distance });
        }
      } catch {
        continue;
      }
    }

    results.sort((a, b) => a.distance - b.distance);
    return results.map((r) => r.style);
  }

  applyStyleToNode(node: SceneNode, styleId: string): boolean {
    try {
      const style = figma.getStyleById(styleId);
      if (!style) return false;

      if (style.type === "PAINT" && "fillStyleId" in node) {
        (node as GeometryMixin).fillStyleId = styleId;
        return true;
      }

      if (style.type === "TEXT" && node.type === "TEXT") {
        (node as TextNode).textStyleId = styleId;
        return true;
      }

      if (style.type === "EFFECT" && "effectStyleId" in node) {
        (node as BlendMixin).effectStyleId = styleId;
        return true;
      }

      return false;
    } catch {
      return false;
    }
  }

  isInitialized(): boolean {
    return this.initialized;
  }

  clearCache(): void {
    this.cache.clear();
    this.allStyles = [];
    this.initialized = false;
  }
}
