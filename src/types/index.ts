export type ScanScope = "selection" | "page" | "file";

export type FindingCategory = "color" | "typography" | "effects" | "layout" | "variable";

export type MatchType = "exact" | "similar" | "fuzzy";

export type ColorType = "fill" | "stroke";

export interface FigmaColor {
  r: number;
  g: number;
  b: number;
  a: number;
}

export interface VariableInfo {
  id: string;
  name: string;
  type: "COLOR" | "FLOAT" | "STRING" | "BOOLEAN";
  resolvedType: VariableResolvedType;
  value: VariableValue;
  source: "local" | "library";
  libraryName?: string;
  remote: boolean;
  key: string;
}

export type VariableResolvedType =
  | "COLOR"
  | "FLOAT"
  | "STRING"
  | "BOOLEAN";

export type VariableValue =
  | FigmaColor
  | number
  | string
  | boolean;

export interface StyleInfo {
  id: string;
  name: string;
  type: "FILL" | "TEXT" | "EFFECT" | "GRID";
  source: "local" | "library";
  libraryName?: string;
  remote: boolean;
  key: string;
  description?: string;
}

export interface Finding {
  id: string;
  layerId: string;
  layerName: string;
  layerType: string;
  category: FindingCategory;
  property: string;
  currentValue: string;
  suggestedValue: string | null;
  suggestion: Suggestion | null;
  confidence: number;
  matchType: MatchType | null;
  source: "variable" | "style" | null;
  sourceName: string | null;
  parentChain: string[];
  pageName: string;
}

export interface Suggestion {
  variableId: string | null;
  styleId: string | null;
  name: string;
  type: "variable" | "style";
  category: FindingCategory;
  confidence: number;
  matchType: MatchType;
  distance: number;
  source: "local" | "library";
  libraryName?: string;
}

export interface ScanResult {
  findings: Finding[];
  summary: ScanSummary;
  timestamp: number;
  scope: ScanScope;
}

export interface ScanSummary {
  totalLayersScanned: number;
  hardcodedValuesFound: number;
  variablesFound: number;
  stylesFound: number;
  potentialFixes: number;
  categoriesBreakdown: Record<FindingCategory, number>;
}

export interface ApplyResult {
  success: boolean;
  layersUpdated: number;
  variablesLinked: number;
  stylesApplied: number;
  failedUpdates: number;
  errors: ApplyError[];
  duration: number;
}

export interface ApplyError {
  layerId: string;
  layerName: string;
  findingId: string;
  message: string;
}

export interface ReportData {
  summary: ScanSummary;
  findings: Finding[];
  applyResult: ApplyResult | null;
  timestamp: number;
  duration: number;
  scope: ScanScope;
}

export interface ScanSettings {
  scanColors: boolean;
  scanTypography: boolean;
  scanEffects: boolean;
  scanLayout: boolean;
  scanVariables: boolean;
  exactMatchOnly: boolean;
  similarityThreshold: number;
  matchColorVariables: boolean;
  matchColorStyles: boolean;
  matchTextStyles: boolean;
  matchEffectStyles: boolean;
  matchNumberVariables: boolean;
  safetySkipLibraryAssets: boolean;
  safetySkipInstances: boolean;
  safetyConfirmBulkActions: boolean;
  performanceBatchSize: number;
  performanceAsyncProcessing: boolean;
}

export interface ScannerProgress {
  phase: "scanning" | "matching" | "complete" | "error";
  totalLayers: number;
  scannedLayers: number;
  findingsCount: number;
  currentLayerName: string;
}

export interface FindingFilter {
  category: FindingCategory | "all";
  matchType: MatchType | "all";
  source: "variable" | "style" | "both" | "none" | "all";
  searchQuery: string;
  minConfidence: number;
  maxConfidence: number;
  sortBy: "confidence" | "category" | "layer" | "property" | "currentValue";
  sortOrder: "asc" | "desc";
}

export interface PaginationState {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  items: Finding[];
}

export type TabId = "audit" | "results" | "report" | "settings";
