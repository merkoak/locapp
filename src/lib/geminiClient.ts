// src/lib/geminiClient.ts
// Mock Gemini cultural / tonal risk analysis
// No external API key required.

export type GeminiInput = {
  text: string;
  market?: string;
  audience?: string;
};

export type GeminiAnalysis = {
  overallScore: number; // 0-100
  culturalRiskSummary: string;
  toneSummary: string;
  topRisks: string[];
  improvementIdeas: string[];
};

function riskFromText(text: string): number {
  const len = text.length;
  if (len < 40) return 60;
  if (len < 150) return 75;
  if (len < 400) return 85;
  return 80;
}

export async function analyzeWithGemini(
  input: GeminiInput
): Promise<GeminiAnalysis> {
  const { text, market = "Global", audience = "general" } = input;
  const baseScore = riskFromText(text);

  const lower = text.toLowerCase();
  const risks: string[] = [];
  const improvements: string[] = [];

  if (lower.includes("religion") || lower.includes("politics")) {
    risks.push("Mentions sensitive topics (religion/politics).");
    improvements.push(
      "Clarify stance or avoid polarizing language for this market."
    );
  }
  if (lower.includes("best") || lower.includes("number one")) {
    risks.push("Uses absolute claims that may sound unrealistic.");
    improvements.push("Use more specific, verifiable value propositions.");
  }
  if (risks.length === 0) {
    risks.push(
      "No obvious red flags, but local validation is still recommended."
    );
  }
  if (improvements.length === 0) {
    improvements.push(
      "Run a quick human review with a native marketing team."
    );
  }

  return {
    overallScore: baseScore,
    culturalRiskSummary: `No critical cultural red flags detected for ${market}, but subtle issues may still exist.`,
    toneSummary: `Tone seems acceptable for a ${audience} audience, but could be refined for higher trust.`,
    topRisks: risks,
    improvementIdeas: improvements,
  };
}
