import { useState, useCallback, useMemo } from "react";
import type {
  Finding,
  FindingFilter,
  PaginationState,
} from "@/types";
import { DEFAULT_FINDING_FILTER, DEFAULT_PAGE_SIZE, PAGE_SIZES } from "@/shared/constants";
import { paginate } from "@/utils/helpers";

interface UseResultsReturn {
  findings: Finding[];
  filteredFindings: Finding[];
  selectedIds: Set<string>;
  filter: FindingFilter;
  pagination: PaginationState;
  isApplying: boolean;
  setFindings: (findings: Finding[]) => void;
  setFilter: (filter: Partial<FindingFilter>) => void;
  setPage: (page: number) => void;
  setPageSize: (pageSize: number) => void;
  toggleSelection: (id: string) => void;
  selectAll: () => void;
  deselectAll: () => void;
  jumpToLayer: (layerId: string) => void;
  applySingle: (findingId: string) => void;
  applySelected: () => void;
  applyAll: () => void;
}

export function useResults(): UseResultsReturn {
  const [findings, setFindings] = useState<Finding[]>([]);
  const [filter, setFilterState] = useState<FindingFilter>(
    DEFAULT_FINDING_FILTER as FindingFilter,
  );
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [page, setPageState] = useState(1);
  const [pageSize, setPageSizeState] = useState(DEFAULT_PAGE_SIZE);
  const [isApplying, setIsApplying] = useState(false);

  const filteredFindings = useMemo(() => {
    let filtered = [...findings];

    if (filter.category !== "all") {
      filtered = filtered.filter((f) => f.category === filter.category);
    }

    if (filter.matchType !== "all") {
      filtered = filtered.filter((f) => f.matchType === filter.matchType);
    }

    if (filter.source !== "all") {
      if (filter.source === "both") {
        filtered = filtered.filter((f) => f.source !== null);
      } else if (filter.source === "none") {
        filtered = filtered.filter((f) => f.source === null);
      } else {
        filtered = filtered.filter((f) => f.source === filter.source);
      }
    }

    if (filter.searchQuery) {
      const query = filter.searchQuery.toLowerCase();
      filtered = filtered.filter(
        (f) =>
          f.layerName.toLowerCase().includes(query) ||
          f.currentValue.toLowerCase().includes(query) ||
          (f.suggestedValue &&
            f.suggestedValue.toLowerCase().includes(query)) ||
          f.property.toLowerCase().includes(query),
      );
    }

    if (filter.minConfidence > 0) {
      filtered = filtered.filter((f) => f.confidence >= filter.minConfidence);
    }

    if (filter.maxConfidence < 100) {
      filtered = filtered.filter((f) => f.confidence <= filter.maxConfidence);
    }

    const sorted = [...filtered].sort((a, b) => {
      const getValue = (f: Finding): string | number => {
        switch (filter.sortBy) {
          case "confidence":
            return f.confidence;
          case "category":
            return f.category;
          case "layer":
            return f.layerName;
          case "property":
            return f.property;
          case "currentValue":
            return f.currentValue;
          default:
            return f.confidence;
        }
      };

      const aVal = getValue(a);
      const bVal = getValue(b);

      if (typeof aVal === "number" && typeof bVal === "number") {
        return filter.sortOrder === "desc" ? bVal - aVal : aVal - bVal;
      }

      const cmp = String(aVal).localeCompare(String(bVal));
      return filter.sortOrder === "desc" ? -cmp : cmp;
    });

    return sorted;
  }, [findings, filter]);

  const pagination = useMemo(() => {
    const total = filteredFindings.length;
    const totalPages = Math.ceil(total / pageSize);
    const safePage = Math.min(page, Math.max(1, totalPages));

    const { items } = paginate(filteredFindings, safePage, pageSize);

    return {
      page: safePage,
      pageSize,
      total,
      items,
      totalPages,
    };
  }, [filteredFindings, page, pageSize]);

  const setFilter = useCallback((newFilter: Partial<FindingFilter>) => {
    setFilterState((prev) => ({ ...prev, ...newFilter }));
    setPage(1);
  }, []);

  const setPage = useCallback((newPage: number) => {
    setPageState(newPage);
  }, []);

  const setPageSize = useCallback((newSize: number) => {
    if (PAGE_SIZES.includes(newSize as (typeof PAGE_SIZES)[number])) {
      setPageSizeState(newSize);
      setPage(1);
    }
  }, []);

  const toggleSelection = useCallback((id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  const selectAll = useCallback(() => {
    const ids = filteredFindings.map((f) => f.id);
    setSelectedIds(new Set(ids));
  }, [filteredFindings]);

  const deselectAll = useCallback(() => {
    setSelectedIds(new Set());
  }, []);

  const applySingle = useCallback((findingId: string) => {
    setIsApplying(true);
    parent.postMessage(
      { pluginMessage: { type: "apply-fix", findingId } },
      "*",
    );
  }, []);

  const applySelected = useCallback(() => {
    if (selectedIds.size === 0) return;
    setIsApplying(true);
    parent.postMessage(
      {
        pluginMessage: {
          type: "apply-selected",
          findingIds: Array.from(selectedIds),
        },
      },
      "*",
    );
  }, [selectedIds]);

  const applyAll = useCallback(() => {
    setIsApplying(true);
    parent.postMessage(
      { pluginMessage: { type: "apply-all" } },
      "*",
    );
  }, []);

  const jumpToLayer = useCallback((layerId: string) => {
    parent.postMessage(
      { pluginMessage: { type: "jump-to-layer", layerId } },
      "*",
    );
  }, []);

  return {
    findings: pagination.items,
    filteredFindings: pagination.items,
    selectedIds,
    filter,
    pagination,
    isApplying,
    setFindings,
    setFilter,
    setPage,
    setPageSize,
    toggleSelection,
    selectAll,
    deselectAll,
    applySingle,
    applySelected,
    applyAll,
    jumpToLayer,
  };
}
