// src/lib/geminiClient.ts
// Google Gemini cultural analysis wrapper (ASCII only)

import { GoogleGenerativeAI } from "@google/generative-ai";

export type GeminiInput = {
  text: string;
  market?: string;
  audience?: string;
};

export type GeminiAnalysis = {
  overallScore: number;
  culturalRiskSummary: string;
  toneSummary: string;
  topRisks: string[];
  improvementIdeas: string[];
};

const geminiApiKey = process.env.GEMINI_API_KEY;

const genAI = geminiApiKey ? new GoogleGenerativeAI(geminiApiKey) : null;

export async function analyzeWithGemini(
  input: GeminiInput
): Promise<GeminiAnalysis> {
  const { text, market = "Global", audience = "general" } = input;

  // Fallback mock when env is missing
  if (!genAI) {
    return {
      overallScore: 60,
      culturalRiskSummary:
        "Gemini is not configured; using mock cultural risk summary.",
      toneSummary:
        "Tone seems acceptable for a general audience, but this is a mock response.",
      topRisks: [
        "Real cultural red flags may exist. Run a human localization review.",
      ],
      improvementIdeas: [
        "Configure Gemini API and rerun the audit.",
        "Have a native localization specialist review this copy.",
      ],
    };
  }

  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
  });

  const prompt = `
You are a cultural and tone-of-voice risk auditor for marketing copy.

Return a STRICT JSON object with the following shape (no markdown, no extra text):

{
  "overallScore": number from 0 to 100,
  "culturalRiskSummary": "short paragraph",
  "toneSummary": "short paragraph",
  "topRisks": ["bullet 1", "bullet 2"],
  "improvementIdeas": ["idea 1", "idea 2"]
}

Text to analyze:
"${text}"

Target market: ${market}
Audience: ${audience}
`;

  const result = await model.generateContent(prompt);
  const responseText = result.response.text();

  let parsed: any;
  try {
    parsed = JSON.parse(responseText);
  } catch {
    parsed = {
      overallScore: 70,
      culturalRiskSummary:
        "Model response could not be parsed. Defaulting to a medium risk score.",
      toneSummary: "Tone may need additional human review.",
      topRisks: ["Could not parse structured risks from model output."],
      improvementIdeas: [
        "Run a manual review with a native localization specialist.",
      ],
    };
  }

  return {
    overallScore: parsed.overallScore ?? 70,
    culturalRiskSummary:
      parsed.culturalRiskSummary ??
      "No critical cultural red flags detected, but subtle issues may still exist.",
    toneSummary:
      parsed.toneSummary ??
      "Tone seems acceptable but could be refined for higher trust.",
    topRisks:
      parsed.topRisks ?? [
        "No obvious red flags, but local validation is still recommended.",
      ],
    improvementIdeas:
      parsed.improvementIdeas ??
      ["Run a quick human review with a native marketing team."],
  };
}
