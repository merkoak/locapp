// src/lib/geminiClient.ts
// ASCII-safe Gemini client using @google/genai for cultural and tone-of-voice analysis.

import { GoogleGenAI } from "@google/genai";

const GEMINI_API_KEY =
  process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || "";

const GEMINI_MODEL_ID =
  process.env.GEMINI_MODEL_ID || process.env.GEMINI_MODEL || "gemini-2.5-flash";

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
    "Analysis is temporarily unavailable right now due to system limits. Please try again later.",
  toneSummary:
    "Analysis is temporarily unavailable right now due to system limits. Please try again later.",
  topRisks: [
    "Gemini analysis is temporarily unavailable due to rate limits.",
  ],
  improvementIdeas: [
    "Please try again later.",
  ],
};

function buildPrompt(text: string, market?: string, audience?: string): string {
  const targetMarket = market?.trim() || "unspecified market";
  const targetAudience = audience?.trim() || "unspecified audience";

  // Prompt'u güncelledim: "Section X" gibi başlıkları YAZMA diye özellikle belirttim.
  return [
    "You are a senior localization strategist and cultural risk auditor.",
    "Analyze the following marketing copy.",
    "",
    "IMPORTANT INSTRUCTIONS:",
    "1. Divide your response into exactly 4 parts using the delimiter '###SECTION###'.",
    "2. Do NOT repeat the section headers or instructions in your output.",
    "3. Just write the analysis content directly.",
    "",
    "The 4 parts must be:",
    "(Part 1) Cultural risk summary (taboos, sensitivities).",
    "###SECTION###",
    "(Part 2) Tone-of-voice summary (style, emotional color).",
    "###SECTION###",
    "(Part 3) Top risks (2-4 concise sentences, one per line).",
    "###SECTION###",
    "(Part 4) Improvement ideas (2-4 concise sentences, one per line).",
    "",
    "Be specific to this text.",
    "",
    `Target market: ${targetMarket}`,
    `Target audience: ${targetAudience}`,
    "",
    "Text to Analyze:",
    text,
  ].join("\n");
}

// Yardımcı Fonksiyon: "Section 1: ..." veya parantez içindeki talimatları temizler.
function cleanSectionText(text: string): string {
  if (!text) return "";
  return text
    // "Section 1:", "Part 1:", "Cultural Risk:" gibi başlangıçları siler
    .replace(/^(Section|Part) \d+[:.]?\s*/i, "")
    // Parantez içindeki açıklamalar satır başındaysa siler (örn: "(taboos...)")
    .replace(/^.*\(.*?\).*\n?/gm, "") 
    // "Cultural risk summary" gibi tekrar eden başlıkları siler
    .replace(/^(Cultural risk summary|Tone-of-voice summary|Top risks|Improvement ideas)[:.]?\s*/i, "")
    .trim();
}

export async function analyzeWithGemini(
  text: string,
  market?: string,
  audience?: string
): Promise<GeminiAnalysis> {
  if (!GEMINI_API_KEY) {
    console.warn(
      "[Gemini] GEMINI_API_KEY is not set. Returning fallback analysis."
    );
    return FALLBACK_ANALYSIS;
  }

  try {
    const client = new GoogleGenAI({
      apiKey: GEMINI_API_KEY,
    });

    const prompt = buildPrompt(text, market, audience);

    const response = await client.models.generateContent({
      model: GEMINI_MODEL_ID,
      contents: prompt,
    });

    const outputText =
      typeof (response as any).text === "function"
        ? (response as any).text()
        : (response as any).text || "";

    if (!outputText || !outputText.trim()) {
      console.warn("[Gemini] Empty text from API, using fallback.");
      return FALLBACK_ANALYSIS;
    }

    const lengthFactor = Math.min(outputText.length / 800, 1);
    const baseScore = 72;
    const overallScore = Math.max(40, Math.round(baseScore * lengthFactor));

    // Yanıtı bölüyoruz
    const sections = outputText.split("###SECTION###");

    // Her bölümü "cleanSectionText" ile temizliyoruz
    const culturalRiskSummary = cleanSectionText(sections[0]) || "Analysis incomplete.";
    const toneSummary = cleanSectionText(sections[1]) || "Tone analysis not provided.";
    
    const topRisksRaw = cleanSectionText(sections[2]) || "";
    const topRisks = topRisksRaw
      .split("\n")
      .map((r) => r.replace(/^[-*•]\s*/, "").trim())
      .filter((r) => r.length > 5);

    const ideasRaw = cleanSectionText(sections[3]) || "";
    const improvementIdeas = ideasRaw
      .split("\n")
      .map((i) => i.replace(/^[-*•]\s*/, "").trim())
      .filter((i) => i.length > 5);

    if (topRisks.length === 0) topRisks.push("No specific risks detected.");
    if (improvementIdeas.length === 0) improvementIdeas.push("Review content for general clarity.");

    return {
      overallScore,
      culturalRiskSummary,
      toneSummary,
      topRisks,
      improvementIdeas,
    };
  } catch (error) {
    console.error("[Gemini] analysis error with @google/genai:", error);
    return FALLBACK_ANALYSIS;
  }
}

export async function runGeminiAnalysis(
  text: string,
  market?: string,
  audience?: string
): Promise<GeminiAnalysis> {
  return analyzeWithGemini(text, market, audience);
}