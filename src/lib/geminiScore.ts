import { validateCriticalIssues } from "./criticalTranslation";
import type { CriticalTranslationIssue } from "./criticalTranslation";
export type GeminiAnalysis = {
  criticalIssues?: CriticalTranslationIssue[];
  overallScore: number;
  scoreReason?: string;
  contextSummary?: string;
  localizationSummary?: string;
  threatLevel?: "none" | "possible" | "explicit" | "unavailable";
  threatSummary?: string;
  culturalRiskSummary: string;
  toneSummary: string;
  topRisks: string[];
  improvementIdeas: string[];
};

export class UnanalyzableTextError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "UnanalyzableTextError";
  }
}

export function parseGeminiAnalysis(output: string, sourceText: string): GeminiAnalysis {
  const value: unknown = JSON.parse(output);
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new Error("Invalid analysis object");
  }
  const data = value as Record<string, unknown>;
  if (typeof data.isAnalyzable !== "boolean") throw new Error("Missing input assessment");
  if (!data.isAnalyzable) {
    if (typeof data.inputIssue !== "string" || !data.inputIssue.trim()) {
      throw new Error("Missing input issue");
    }
    throw new UnanalyzableTextError("This text could not be analyzed. Please enter meaningful content with enough context.");
  }
  if (typeof data.overallScore !== "number" || !Number.isFinite(data.overallScore) ||
      data.overallScore < 0 || data.overallScore > 100) {
    throw new Error("Invalid cultural safety score");
  }
  const readText = (key: string): string => {
    const text = data[key];
    if (typeof text !== "string" || !text.trim()) throw new Error(`Missing ${key}`);
    return text.trim();
  };
  const readList = (key: string): string[] => {
    const list = data[key];
    if (!Array.isArray(list) || !list.every(item => typeof item === "string" && item.trim())) {
      throw new Error(`Invalid ${key}`);
    }
    return list.map(item => (item as string).trim());
  };
  if (!["none", "possible", "explicit"].includes(String(data.threatLevel))) {
    throw new Error("Invalid threat assessment");
  }
  // A score without an explanation is not a complete assessment.
  readText("scoreReason");
  return {
    criticalIssues: validateCriticalIssues(data.criticalIssues, sourceText),
    overallScore: Math.round(data.overallScore),
    scoreReason: readText("scoreReason"),
    contextSummary: readText("contextSummary"),
    localizationSummary: readText("localizationSummary"),
    threatLevel: data.threatLevel as "none" | "possible" | "explicit",
    threatSummary: readText("threatSummary"),
    culturalRiskSummary: readText("culturalRiskSummary"),
    toneSummary: readText("toneSummary"),
    topRisks: readList("topRisks"),
    improvementIdeas: readList("improvementIdeas"),
  };
}
