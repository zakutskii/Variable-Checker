export const DEFAULT_SCAN_SETTINGS = {
  scanColors: true,
  scanTypography: true,
  scanEffects: true,
  scanLayout: true,
  scanVariables: true,
  exactMatchOnly: false,
  similarityThreshold: 0.9,
  matchColorVariables: true,
  matchColorStyles: true,
  matchTextStyles: true,
  matchEffectStyles: true,
  matchNumberVariables: true,
  safetySkipLibraryAssets: true,
  safetySkipInstances: true,
  safetyConfirmBulkActions: true,
  performanceBatchSize: 500,
  performanceAsyncProcessing: true,
} as const;

export const DEFAULT_FINDING_FILTER = {
  category: "all" as const,
  matchType: "all" as const,
  source: "all" as const,
  searchQuery: "",
  minConfidence: 0,
  maxConfidence: 100,
  sortBy: "confidence" as const,
  sortOrder: "desc" as const,
};

export const PAGE_SIZES = [25, 50, 100, 250] as const;

export const DEFAULT_PAGE_SIZE = 50;

export const SCAN_BATCH_SIZE = 100;

export const SIMILARITY_COLOR_THRESHOLD = 0.95;
export const SIMILARITY_SPACING_THRESHOLD = 0.9;
export const SIMILARITY_RADIUS_THRESHOLD = 0.9;
export const SIMILARITY_TYPOGRAPHY_THRESHOLD = 0.85;

export const CATEGORY_LABELS: Record<string, string> = {
  color: "Colors",
  typography: "Typography",
  effects: "Effects",
  layout: "Layout",
  variable: "Variables",
};

export const CATEGORY_COLORS: Record<string, string> = {
  color: "#EC4899",
  typography: "#3B82F6",
  effects: "#F59E0B",
  layout: "#10B981",
  variable: "#8B5CF6",
};
