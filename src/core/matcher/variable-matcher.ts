import type { Finding, Suggestion, VariableInfo, ScanSettings } from "@/types";
import { VariableResolver } from "@/core/variables/variable-resolver";

export class VariableMatcher {
  private variableResolver: VariableResolver;

  constructor(variableResolver: VariableResolver) {
    this.variableResolver = variableResolver;
  }

  async match(
    finding: Finding,
    settings: ScanSettings,
  ): Promise<Suggestion | null> {
    if (finding.category !== "layout" && finding.category !== "variable") {
      return null;
    }

    if (!settings.matchNumberVariables) return null;

    const numericValue = this.extractNumericValue(finding.currentValue);
    if (numericValue === null) return null;

    const suggestions = this.findNumericVariableMatches(
      numericValue,
      settings,
    );

    return suggestions[0] ?? null;
  }

  private extractNumericValue(value: string): number | null {
    const cleaned = value.replace(/px$/, "").trim();
    const num = parseFloat(cleaned);
    if (isNaN(num)) return null;
    return num;
  }

  private findNumericVariableMatches(
    value: number,
    settings: ScanSettings,
  ): Suggestion[] {
    const suggestions: Suggestion[] = [];
    const floatVars = this.variableResolver.getFloatVariables();

    const localVars = floatVars.filter((v) => v.source === "local");
    const libraryVars = floatVars.filter((v) => v.source === "library");

    const findMatches = (
      variables: VariableInfo[],
      source: "local" | "library",
    ) => {
      for (const variable of variables) {
        const varValue = variable.value;

        if (typeof varValue === "number") {
          if (varValue === value) {
            suggestions.push({
              variableId: variable.id,
              styleId: null,
              name: variable.name,
              type: "variable",
              category: "layout",
              confidence: 100,
              matchType: "exact",
              distance: 0,
              source,
              libraryName: variable.libraryName,
            });
          } else if (!settings.exactMatchOnly) {
            const diff = Math.abs(varValue - value);
            const max = Math.max(Math.abs(varValue), Math.abs(value), 1);
            const similarity = 1 - Math.min(1, diff / max);

            if (similarity >= settings.similarityThreshold) {
              suggestions.push({
                variableId: variable.id,
                styleId: null,
                name: variable.name,
                type: "variable",
                category: "layout",
                confidence: Math.round(similarity * 100),
                matchType: "similar",
                distance: Math.round(diff * 100) / 100,
                source,
                libraryName: variable.libraryName,
              });
            }
          }
        }
      }
    };

    findMatches(localVars, "local");
    findMatches(libraryVars, "library");

    suggestions.sort((a, b) => {
      const priorityOrder = (s: Suggestion): number => {
        if (s.source === "local") return 0;
        return 1;
      };
      const priorityDiff = priorityOrder(a) - priorityOrder(b);
      if (priorityDiff !== 0) return priorityDiff;
      return b.confidence - a.confidence;
    });

    return suggestions;
  }
}
