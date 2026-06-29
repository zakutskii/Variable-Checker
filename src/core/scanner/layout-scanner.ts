import type { Finding, ScanSettings } from "@/types";
import { generateId, findParentChain } from "@/utils/helpers";

export class LayoutScanner {
  scan(node: SceneNode, _settings: ScanSettings): Finding[] {
    const findings: Finding[] = [];
    const pageName = node.parent?.type === "PAGE" ? (node.parent as PageNode).name : "Unknown";

    if ("cornerRadius" in node && typeof node.cornerRadius === "number") {
      const cornerRadius = node.cornerRadius as number;

      if (cornerRadius > 0) {
        findings.push({
          id: generateId(),
          layerId: node.id,
          layerName: node.name,
          layerType: node.type,
          category: "layout",
          property: "cornerRadius",
          currentValue: `${cornerRadius}px`,
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
    }

    if (
      "minWidth" in node &&
      typeof node.minWidth === "number" &&
      node.minWidth > 0
    ) {
      findings.push({
        id: generateId(),
        layerId: node.id,
        layerName: node.name,
        layerType: node.type,
        category: "layout",
        property: "minWidth",
        currentValue: `${node.minWidth}px`,
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

    if (
      "maxWidth" in node &&
      typeof node.maxWidth === "number" &&
      node.maxWidth > 0
    ) {
      findings.push({
        id: generateId(),
        layerId: node.id,
        layerName: node.name,
        layerType: node.type,
        category: "layout",
        property: "maxWidth",
        currentValue: `${node.maxWidth}px`,
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

    if (
      "minHeight" in node &&
      typeof node.minHeight === "number" &&
      node.minHeight > 0
    ) {
      findings.push({
        id: generateId(),
        layerId: node.id,
        layerName: node.name,
        layerType: node.type,
        category: "layout",
        property: "minHeight",
        currentValue: `${node.minHeight}px`,
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

    if (
      "maxHeight" in node &&
      typeof node.maxHeight === "number" &&
      node.maxHeight > 0
    ) {
      findings.push({
        id: generateId(),
        layerId: node.id,
        layerName: node.name,
        layerType: node.type,
        category: "layout",
        property: "maxHeight",
        currentValue: `${node.maxHeight}px`,
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

    if ("layoutMode" in node && node.layoutMode !== "NONE") {
      const frameNode = node as FrameNode;

      if (frameNode.itemSpacing > 0) {
        findings.push({
          id: generateId(),
          layerId: node.id,
          layerName: node.name,
          layerType: node.type,
          category: "layout",
          property: "itemSpacing",
          currentValue: `${frameNode.itemSpacing}px`,
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

      const paddingProps: { key: string; value: number }[] = [
        { key: "paddingTop", value: frameNode.paddingTop },
        { key: "paddingBottom", value: frameNode.paddingBottom },
        { key: "paddingLeft", value: frameNode.paddingLeft },
        { key: "paddingRight", value: frameNode.paddingRight },
      ];

      for (const prop of paddingProps) {
        if (prop.value > 0) {
          findings.push({
            id: generateId(),
            layerId: node.id,
            layerName: node.name,
            layerType: node.type,
            category: "layout",
            property: prop.key,
            currentValue: `${prop.value}px`,
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
      }
    }

    if ("width" in node && typeof node.width === "number") {
      findings.push({
        id: generateId(),
        layerId: node.id,
        layerName: node.name,
        layerType: node.type,
        category: "layout",
        property: "width",
        currentValue: `${Math.round(node.width)}px`,
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

    if ("height" in node && typeof node.height === "number") {
      findings.push({
        id: generateId(),
        layerId: node.id,
        layerName: node.name,
        layerType: node.type,
        category: "layout",
        property: "height",
        currentValue: `${Math.round(node.height)}px`,
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
}
