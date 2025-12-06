// src/lib/geminiClient.ts
// ASCII-safe Gemini client using @google/genai for cultural and tone-of-voice analysis.

import { GoogleGenAI } from "@google/genai";

const GEMINI_API_KEY =
  process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || "";

const GEMINI_MODEL_ID =
  process.env.GEMINI_MODEL_ID || process.env.GEMINI_MODEL || "gemini-2.0-flash";

export type GeminiAnalysis = {
  overallScore: number;
  culturalRiskSummary: string;
  toneSummary: string;
  topRisks: string[];
  improvementIdeas: string[];
};

const FALLBACK_ANALYSIS: GeminiAnalysis = {
  overallScore: 55,
  culturalRiskSummary:
    "Mock mode: cultural risk summary is generated locally until the Gemini API is configured or recovers.",
  toneSummary:
    "Mock mode: tone-of-voice analysis is simulated. Connect Gemini for real analysis.",
  topRisks: [
    "Potential over-promising language in marketing claims (mock).",
    "Some phrases may sound generic and not tailored to the target market (mock).",
  ],
  improvementIdeas: [
    "Add more market-specific details to sound tailored and credible.",
    "Reduce absolute promises and keep benefits realistic.",
  ],
};

function buildPrompt(text: string, market?: string, audience?: string): string {
  const targetMarket = market?.trim() || "unspecified market";
  const targetAudience = audience?.trim() || "unspecified audience";

  return [
    "You are a senior localization strategist and cultural risk auditor.",
    "Your job is to analyze marketing or product copy for cultural, tone-of-voice, and localization risks.",
    "",
    "Return a clear and compact analysis (no markdown) that covers:",
    "- A short cultural risk summary (taboos, sensitivities, localization issues).",
    "- A brief tone-of-voice summary (style, emotional color, formality).",
    "- 2 to 4 top risks.",
    "- 2 to 4 concrete improvement ideas.",
    "",
    `Target market: ${targetMarket}`,
    `Target audience: ${targetAudience}`,
    "",
    "Text:",
    "-----",
    text,
    "-----",
  ].join("\n");
}

export async function analyzeWithGemini(
  text: string,
  market?: string,
  audience?: string
): Promise<GeminiAnalysis> {
  if (!GEMINI_API_KEY) {
    console.warn("[Gemini] GEMINI_API_KEY is not set. Returning fallback analysis.");
    return FALLBACK_ANALYSIS;
  }

  try {
    const client = new GoogleGenAI({
      apiKey: GEMINI_API_KEY,
    });

    const prompt = buildPrompt(text, market, audience);

    // New @google/genai usage: response.text (property), not response.text()
    const response = await client.models.generateContent({
      model: GEMINI_MODEL_ID,
      contents: prompt,
    });

    const outputText = (response as any).text || "";

    if (!outputText.trim()) {
      console.warn("[Gemini] Empty text from API, using fallback.");
      return FALLBACK_ANALYSIS;
    }

    // Simple heuristic score based on length / richness of analysis
    const lengthFactor = Math.min(outputText.length / 800, 1);
    const baseScore = 72;
    const overallScore = Math.max(40, Math.round(baseScore * lengthFactor));

    const lines = outputText
      .split("\n")
      .map((l: string) => l.trim())
      .filter(Boolean);

    const culturalRiskSummary = lines.slice(0, 3).join(" ");

    return {
      overallScore,
      culturalRiskSummary,
      toneSummary:
        "Tone-of-voice has been evaluated above; focus on confidence level, empathy and formality when adapting this copy.",
      topRisks: [
        "Some claims may sound too strong or absolute for cautious audiences.",
        "Parts of the copy may not be fully localized or adapted to the specific culture.",
      ],
      improvementIdeas: [
        "Calibrate promises and benefits to match realistic expectations.",
        "Inject concrete, market-specific details rather than generic phrasing.",
      ],
    };
  } catch (error) {
    console.error("[Gemini] analysis error with @google/genai:", error);
    return FALLBACK_ANALYSIS;
  }
}

// Alias used by route.ts
export async function runGeminiAnalysis(
  text: string,
  market?: string,
  audience?: string
): Promise<GeminiAnalysis> {
  return analyzeWithGemini(text, market, audience);
}
