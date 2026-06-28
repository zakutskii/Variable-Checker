import type { Finding, ScanSettings } from "@/types";
import { generateId, findParentChain } from "@/utils/helpers";

export class EffectsScanner {
  scan(node: SceneNode, _settings: ScanSettings): Finding[] {
    const findings: Finding[] = [];

    if (!("effects" in node)) return findings;

    const effects = (node as BlendMixin).effects;
    const pageName = node.parent?.type === "PAGE" ? (node.parent as PageNode).name : "Unknown";

    const isLinkedToStyle = "effectStyleId" in node && !!node.effectStyleId;
    if (isLinkedToStyle) return findings;

    for (let i = 0; i < effects.length; i++) {
      const effect = effects[i];
      if (!effect || effect.type === "NONE") continue;

      const effectLabel = this.getEffectLabel(effect);
      const effectDetail = this.getEffectDetail(effect);

      findings.push({
        id: generateId(),
        layerId: node.id,
        layerName: node.name,
        layerType: node.type,
        category: "effects",
        property: `effect[${i}]`,
        currentValue: `${effectLabel}: ${effectDetail}`,
        suggestedValue: null,
        suggestion: null,
        confidence: 0,
        matchType: null,
        source: null,
        sourceName: null,
        parentChain: findParentChain(node),
        pageName,
      });
    }

    return findings;
  }

  private getEffectLabel(effect: Effect): string {
    switch (effect.type) {
      case "DROP_SHADOW":
        return "Drop Shadow";
      case "INNER_SHADOW":
        return "Inner Shadow";
      case "LAYER_BLUR":
        return "Layer Blur";
      case "BACKGROUND_BLUR":
        return "Background Blur";
      default:
        return effect.type;
    }
  }

  private getEffectDetail(effect: Effect): string {
    switch (effect.type) {
      case "DROP_SHADOW":
      case "INNER_SHADOW": {
        const shadow = effect as DropShadowEffect;
        const parts: string[] = [];
        parts.push(`X:${shadow.offset.x}`);
        parts.push(`Y:${shadow.offset.y}`);
        parts.push(`B:${shadow.radius}`);
        if (shadow.spread !== 0) parts.push(`S:${shadow.spread}`);
        parts.push(`#${this.colorToHex(shadow.color)}`);
        parts.push(`O:${(shadow.opacity * 100).toFixed(0)}%`);
        return parts.join(" ");
      }
      case "LAYER_BLUR":
      case "BACKGROUND_BLUR": {
        const blur = effect as BlurEffect;
        return `R:${blur.radius}px`;
      }
      default:
        return "";
    }
  }

  private colorToHex(color: RGBA): string {
    const toHex = (n: number) =>
      Math.round(n * 255)
        .toString(16)
        .padStart(2, "0");
    return `${toHex(color.r)}${toHex(color.g)}${toHex(color.b)}`;
  }
}
