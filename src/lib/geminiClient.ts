// src/lib/geminiClient.ts
// ASCII-only, Node-safe Gemini client for cultural / tone risk audit.

import { GoogleGenerativeAI } from "@google/generative-ai";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

// Use a model that actually exists for the current API.
// This combination is used in Google's own Next.js quickstarts.
const GEMINI_MODEL_ID = "gemini-2.0-flash-exp";

export type GeminiAnalysis = {
  overallScore: number;
  culturalRiskSummary: string;
  toneSummary: string;
  topRisks: string[];
  improvementIdeas: string[];
};

function clampScore(score: unknown): number {
  const n = typeof score === "number" ? score : Number(score);
  if (!Number.isFinite(n)) return 55;
  if (n < 0) return 0;
  if (n > 100) return 100;
  return Math.round(n);
}

function buildFallbackGeminiAnalysis(): GeminiAnalysis {
  return {
    overallScore: 55,
    culturalRiskSummary:
      "Cultural and localization analysis is running in fallback mode. Treat this as an approximate risk estimate.",
    toneSummary:
      "Tone-of-voice analysis could not be completed with the external model. Defaulting to a neutral risk profile.",
    topRisks: [
      "Some claims may sound generic or not fully localized.",
      "Benefits may read as slightly over-promising in some markets."
    ],
    improvementIdeas: [
      "Add country-specific examples, details or references.",
      "Avoid absolute promises and keep benefits realistic and verifiable."
    ]
  };
}

export async function runGeminiAnalysis(
  text: string
): Promise<GeminiAnalysis> {
  // Empty or whitespace-only text: nothing to analyze, return safe fallback.
  if (!text || !text.trim()) {
    return buildFallbackGeminiAnalysis();
  }

  if (!GEMINI_API_KEY) {
    console.warn(
      "[Gemini] GEMINI_API_KEY is not set. Returning fallback cultural analysis."
    );
    return buildFallbackGeminiAnalysis();
  }

  try {
    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

    const model = genAI.getGenerativeModel({
      model: GEMINI_MODEL_ID,
      generationConfig: {
        temperature: 0.3,
        maxOutputTokens: 512,
        topK: 32,
        topP: 0.8
      }
    });

    const systemPrompt =
      "You are a senior localization strategist and cultural risk auditor. " +
      "You receive marketing or product copy and assess it for cultural risk, " +
      "taboos, tone-of-voice problems and localization issues. " +
      "You must return a strict JSON object, no extra text.";

    const userPrompt =
      "Analyze the following text and return ONLY a JSON object with this exact shape:\n\n" +
      "{\n" +
      '  "overallScore": number,             // 0 - 100 cultural / tone fitness score\n' +
      '  "culturalRiskSummary": string,      // short paragraph\n' +
      '  "toneSummary": string,              // short paragraph\n' +
      '  "topRisks": string[],               // list of concrete risks\n' +
      '  "improvementIdeas": string[]        // list of concrete improvements\n' +
      "}\n\n" +
      "Text to audit:\n" +
      '"""' +
      text +
      '"""';

    const result = await model.generateContent(`${systemPrompt}\n\n${userPrompt}`);

    const raw = result.response.text() || "";

    // Gemini sometimes wraps JSON with extra text. Try to extract the JSON block.
    const match = raw.match(/\{[\s\S]*\}/);
    const jsonText = match ? match[0] : raw;

    let parsed: any;
    try {
      parsed = JSON.parse(jsonText);
    } catch (parseError) {
      console.error(
        "[Gemini] Failed to parse JSON from response. Raw text:",
        raw
      );
      return buildFallbackGeminiAnalysis();
    }

    const analysis: GeminiAnalysis = {
      overallScore: clampScore(parsed.overallScore),
      culturalRiskSummary:
        typeof parsed.culturalRiskSummary === "string" &&
        parsed.culturalRiskSummary.trim().length > 0
          ? parsed.culturalRiskSummary.trim()
          : "No cultural risk summary was provided by the model.",
      toneSummary:
        typeof parsed.toneSummary === "string" &&
        parsed.toneSummary.trim().length > 0
          ? parsed.toneSummary.trim()
          : "No tone-of-voice summary was provided by the model.",
      topRisks:
        Array.isArray(parsed.topRisks) && parsed.topRisks.length > 0
          ? parsed.topRisks.map((item: unknown) => String(item))
          : [
              "The model did not list explicit risks. Review the text manually for taboos and sensitive topics."
            ],
      improvementIdeas:
        Array.isArray(parsed.improvementIdeas) &&
        parsed.improvementIdeas.length > 0
          ? parsed.improvementIdeas.map((item: unknown) => String(item))
          : [
              "Clarify your value proposition and adapt examples to the local market.",
              "Check for idioms, humor or references that may not translate well."
            ]
    };

    return analysis;
  } catch (error) {
    console.error("[Gemini] Analysis error:", error);
    return buildFallbackGeminiAnalysis();
  }
}
