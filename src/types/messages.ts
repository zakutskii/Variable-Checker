import type { ScanScope, ScanSettings, ScanResult, FindingFilter, ApplyResult, ReportData, ScannerProgress, VariableInfo, StyleInfo, FindingCategory } from "./index";

export type PluginMessage =
  | StartScanMessage
  | CancelScanMessage
  | ApplyFixMessage
  | ApplySelectedMessage
  | ApplyAllMessage
  | JumpToLayerMessage
  | RequestReportMessage
  | RequestFindingsMessage
  | UndoLastOperationMessage
  | RequestOptionsMessage
  | ApplyManualMessage;

export type UIMessage =
  | ScanProgressMessage
  | ScanCompleteMessage
  | ScanErrorMessage
  | ApplyProgressMessage
  | ApplyCompleteMessage
  | FindingsDataMessage
  | ReportDataMessage
  | UndoStatusMessage
  | OptionsDataMessage
  | AssetsDataMessage;

export interface StartScanMessage {
  type: "start-scan";
  scope: ScanScope;
  settings: ScanSettings;
}

export interface CancelScanMessage {
  type: "cancel-scan";
}

export interface ApplyFixMessage {
  type: "apply-fix";
  findingId: string;
}

export interface ApplySelectedMessage {
  type: "apply-selected";
  findingIds: string[];
}

export interface ApplyAllMessage {
  type: "apply-all";
  findingIds?: string[];
}

export interface JumpToLayerMessage {
  type: "jump-to-layer";
  layerId: string;
}

export interface RequestReportMessage {
  type: "request-report";
}

export interface RequestFindingsMessage {
  type: "request-findings";
  filter: FindingFilter;
  page: number;
  pageSize: number;
}

export interface UndoLastOperationMessage {
  type: "undo-last-operation";
}

export interface ScanProgressMessage {
  type: "scan-progress";
  payload: ScannerProgress;
}

export interface ScanCompleteMessage {
  type: "scan-complete";
  payload: ScanResult;
}

export interface ScanErrorMessage {
  type: "scan-error";
  payload: { message: string };
}

export interface ApplyProgressMessage {
  type: "apply-progress";
  payload: { current: number; total: number; message: string };
}

export interface ApplyCompleteMessage {
  type: "apply-complete";
  payload: ApplyResult & { appliedFindingIds?: string[] };
}

export interface FindingsDataMessage {
  type: "findings-data";
  payload: {
    findings: ScanResult["findings"];
    total: number;
    page: number;
    pageSize: number;
  };
}

export interface ReportDataMessage {
  type: "report-data";
  payload: ReportData;
}

export interface UndoStatusMessage {
  type: "undo-status";
  payload: { canUndo: boolean; operationDescription: string | null };
}

export interface RequestOptionsMessage {
  type: "request-options";
  category: FindingCategory;
}

export interface ApplyManualMessage {
  type: "apply-manual";
  findingId: string;
  variableId?: string | null;
  styleId?: string | null;
}

export interface OptionsDataMessage {
  type: "options-data";
  payload: {
    category: string;
    variables: VariableInfo[];
    styles: StyleInfo[];
  };
}

export interface AssetsDataMessage {
  type: "assets-data";
  payload: {
    variables: VariableInfo[];
    styles: StyleInfo[];
  };
}
