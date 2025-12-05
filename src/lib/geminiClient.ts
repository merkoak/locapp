// src/lib/geminiClient.ts
// ASCII-only file. Gemini Flash cultural analysis for LocAI.

import { GoogleGenerativeAI } from "@google/generative-ai";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "";
const GEMINI_MODEL_ID = "gemini-flash-latest";

export type GeminiResult = {
  overallScore: number;
  culturalRiskSummary: string;
  toneSummary: string;
  topRisks: string[];
  improvementIdeas: string[];
};

function buildPrompt(
  text: string,
  market: string,
  audience: string
): string {
  return [
    "You are a cultural and tone-of-voice risk auditor for marketing copy.",
    "You do NOT translate. You only analyze.",
    "",
    `Target market: ${market || "Turkey"}`,
    `Audience: ${audience || "general"}`,
    "",
    "Analyze the copy for:",
    "- Cultural taboos and local sensitivities.",
    "- Tone-of-voice risk (over-promising, offensive tone, etc.).",
    "- Any mismatch between message and market.",
    "",
    "Return ONLY a JSON object with this exact shape:",
    "",
    "{",
    '  "overallScore": number (0-100, higher is safer),',
    '  "culturalRiskSummary": "one short paragraph",',
    '  "toneSummary": "one short paragraph about tone of voice and over-promising risk",',
    '  "topRisks": ["bullet 1", "bullet 2", "..."],',
    '  "improvementIdeas": ["bullet 1", "bullet 2", "..."]',
    "}",
    "",
    "Copy to analyze:",
    "-----",
    text,
    "-----"
  ].join("\n");
}

function safeParse(text: string): GeminiResult {
  try {
    const data = JSON.parse(text);

    return {
      overallScore:
        typeof data.overallScore === "number" ? data.overallScore : 65,
      culturalRiskSummary:
        typeof data.culturalRiskSummary === "string"
          ? data.culturalRiskSummary
          : "No cultural summary provided by the model.",
      toneSummary:
        typeof data.toneSummary === "string"
          ? data.toneSummary
          : "No tone summary provided by the model.",
      topRisks: Array.isArray(data.topRisks)
        ? data.topRisks.map((x: unknown) => String(x))
        : ["No explicit risks listed by the model."],
      improvementIdeas: Array.isArray(data.improvementIdeas)
        ? data.improvementIdeas.map((x: unknown) => String(x))
        : ["No improvement suggestions listed by the model."]
    };
  } catch {
    return {
      overallScore: 65,
      culturalRiskSummary:
        "Model response could not be parsed as JSON. Using safe defaults.",
      toneSummary:
        "Tone-of-voice analysis is unavailable due to parsing issues.",
      topRisks: ["No risks extracted from the model response."],
      improvementIdeas: [
        "Review copy with a human localization specialist for concrete suggestions."
      ]
    };
  }
}

/**
 * Single exported function for Gemini analysis.
 */
export async function analyzeWithGemini(
  text: string,
  market: string,
  audience: string
): Promise<GeminiResult> {
  if (!GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is not set. Gemini cannot be called.");
  }

  const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: GEMINI_MODEL_ID });

  const prompt = buildPrompt(text, market, audience);

  const result = await model.generateContent({
    contents: [
      {
        role: "user",
        parts: [{ text: prompt }]
      }
    ]
  });

  const responseText = result.response.text();
  return safeParse(responseText);
}
