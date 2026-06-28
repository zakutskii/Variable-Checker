import type { Finding, FindingCategory, MatchType, ScanSettings } from "@/types";
import { DEFAULT_SCAN_SETTINGS } from "@/shared/constants";

export function generateId(): string {
  return `f_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export function findParentChain(node: { name: string; parent: Record<string, unknown> | null }): string[] {
  const chain: string[] = [];
  let current: Record<string, unknown> | null = node as Record<string, unknown>;
  while (current) {
    chain.unshift(String(current.name));
    const parent = current.parent as Record<string, unknown> | null;
    current = parent !== null && parent !== undefined ? parent : null;
  }
  return chain;
}

export function getNodeTypeLabel(nodeType: string): string {
  return nodeType
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (s) => s.toUpperCase())
    .trim();
}

export function getDefaultSettings(): ScanSettings {
  return { ...DEFAULT_SCAN_SETTINGS } as unknown as ScanSettings;
}

export function getConfidenceLabel(confidence: number): string {
  if (confidence >= 95) return "Very High";
  if (confidence >= 80) return "High";
  if (confidence >= 60) return "Medium";
  if (confidence >= 40) return "Low";
  return "Very Low";
}

export function getConfidenceColor(confidence: number): string {
  if (confidence >= 95) return "text-emerald-500";
  if (confidence >= 80) return "text-green-500";
  if (confidence >= 60) return "text-yellow-500";
  if (confidence >= 40) return "text-orange-500";
  return "text-red-500";
}

export function getMatchTypeLabel(matchType: MatchType | null): string {
  switch (matchType) {
    case "exact":
      return "Exact";
    case "similar":
      return "Similar";
    case "fuzzy":
      return "Fuzzy";
    default:
      return "N/A";
  }
}

export function getCategoryIcon(category: FindingCategory): string {
  switch (category) {
    case "color":
      return "Palette";
    case "typography":
      return "Type";
    case "effects":
      return "Sparkles";
    case "layout":
      return "Layout";
    case "variable":
      return "Variable";
  }
}

export function truncateLayerName(name: string, maxLength: number = 40): string {
  if (name.length <= maxLength) return name;
  return name.substring(0, maxLength - 3) + "...";
}

export function formatNumber(num: number): string {
  return new Intl.NumberFormat().format(num);
}

export function groupBy<T>(items: T[], keyFn: (item: T) => string): Record<string, T[]> {
  const groups: Record<string, T[]> = {};
  for (const item of items) {
    const key = keyFn(item);
    if (!groups[key]) groups[key] = [];
    groups[key].push(item);
  }
  return groups;
}

export function paginate<T>(items: T[], page: number, pageSize: number): { items: T[]; total: number; totalPages: number } {
  const total = items.length;
  const totalPages = Math.ceil(total / pageSize);
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  return {
    items: items.slice(start, end),
    total,
    totalPages,
  };
}

export function escapeCsvField(value: string): string {
  if (value.includes(",") || value.includes('"') || value.includes("\n")) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

export function generateCsv(findings: Finding[]): string {
  const headers = ["Type", "Layer", "Current Value", "Suggested Replacement", "Confidence", "Match Type", "Category", "Page"];
  const rows = findings.map((f) => [
    f.layerType,
    f.layerName,
    f.currentValue,
    f.suggestedValue ?? "",
    String(f.confidence),
    f.matchType ?? "",
    f.category,
    f.pageName,
  ]);

  const headerLine = headers.map(escapeCsvField).join(",");
  const dataLines = rows.map((row) => row.map(escapeCsvField).join(","));
  return [headerLine, ...dataLines].join("\n");
}

export function downloadFile(content: string, filename: string, mimeType: string = "text/plain"): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
