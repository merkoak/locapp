export type CriticalTranslationIssue = {
  kind: "literal_meaning_break" | "incoherent_meaning";
  phrase: string;
  explanation: string;
  suggestion: string;
};

export function validateCriticalIssues(value: unknown, sourceText: string): CriticalTranslationIssue[] {
  if (!Array.isArray(value)) throw new Error("Missing critical issue assessment");
  return value.map((entry: unknown) => {
    if (!entry || typeof entry !== "object") throw new Error("Invalid critical issue");
    const issue = entry as Record<string, unknown>;
    if (issue.kind !== "literal_meaning_break" && issue.kind !== "incoherent_meaning") {
      throw new Error("Invalid critical issue kind");
    }
    for (const field of ["phrase", "explanation", "suggestion"]) {
      if (typeof issue[field] !== "string" || !(issue[field] as string).trim()) {
        throw new Error(`Missing critical issue ${field}`);
      }
    }
    const phrase = (issue.phrase as string).trim();
    if (!sourceText.includes(phrase)) throw new Error("Critical evidence is not in the input");
    return {
      kind: issue.kind,
      phrase,
      explanation: (issue.explanation as string).trim(),
      suggestion: (issue.suggestion as string).trim(),
    };
  });
}

export function calculateOverallScore(cultural: number, sentiment: number, issues: CriticalTranslationIssue[]): number {
  const weighted = Math.round(cultural * 0.7 + sentiment * 0.3);
  return issues.length ? Math.min(weighted, 39) : weighted;
}
