// src/app/api/analyze/route.ts
// LocAI analyze endpoint – Watson + Gemini with safe fallback to mocks.
// ASCII-only file.

import { NextResponse } from "next/server";
import { runWatsonAnalysis } from "@/lib/ibmWatson";
import { analyzeWithGemini, GeminiResult } from "@/lib/geminiClient";

export const runtime = "nodejs";

type RiskLevel = "low" | "medium" | "high";

type WatsonAnalysis = {
  overallScore: number;
  sentimentLabel: "positive" | "neutral" | "negative";
  sentimentScore: number;
  topFlags: string[];
};

type GeminiAnalysis = GeminiResult;

type AnalysisResult = {
  overallScore: number;
  riskLevel: RiskLevel;
  watson: WatsonAnalysis;
  gemini: GeminiAnalysis;
};

function getRiskLevel(score: number): RiskLevel {
  if (score < 70) return "high";
  if (score < 85) return "medium";
  return "low";
}

function safeNumber(value: unknown, fallback: number): number {
  return typeof value === "number" && !Number.isNaN(value) ? value : fallback;
}

// If any env is missing we go straight to mock mode
const USE_MOCK =
  !process.env.IBM_API_KEY ||
  !process.env.IBM_API_URL ||
  !process.env.GEMINI_API_KEY;

// Simple Watson mock
async function mockWatson(text: string): Promise<WatsonAnalysis> {
  const lenFactor = Math.min(text.length / 400, 1);
  const base = 60 + Math.round(lenFactor * 20) - 10;

  return {
    overallScore: Math.max(30, Math.min(95, base)),
    sentimentLabel: "neutral",
    sentimentScore: 0.05,
    topFlags: [
      "Mock mode: Watson API is not configured or failed.",
      "Connect IBM NLU credentials in .env.local for real sentiment analysis."
    ]
  };
}

// Simple Gemini mock
async function mockGemini(text: string): Promise<GeminiAnalysis> {
  const lenFactor = Math.min(text.length / 400, 1);
  const base = 65 + Math.round(lenFactor * 15) - 10;

  return {
    overallScore: Math.max(35, Math.min(96, base)),
    culturalRiskSummary:
      "Mock mode: cultural risk summary is generated locally until Gemini API is configured or recovers.",
    toneSummary:
      "Mock mode: tone-of-voice analysis is simulated. Connect Gemini Flash for real analysis.",
    topRisks: [
      "Potential over-promising language in marketing claims (mock).",
      "Some phrases may sound generic and not tailored to the target market (mock)."
    ],
    improvementIdeas: [
      "Add more market-specific details to sound tailored and credible.",
      "Reduce absolute promises and keep benefits realistic."
    ]
  };
}

export async function POST(request: Request) {
  let text = "";

  try {
    const body = await request.json().catch(() => null);

    if (!body || typeof body.text !== "string") {
      return NextResponse.json(
        { error: "Missing or invalid 'text' field." },
        { status: 400 }
      );
    }

    text = body.text.trim();
    const market: string =
      typeof body.market === "string" ? body.market : "Turkey";
    const audience: string =
      typeof body.audience === "string" ? body.audience : "general";

    if (!text) {
      return NextResponse.json(
        { error: "Text cannot be empty." },
        { status: 400 }
      );
    }

    let watson: WatsonAnalysis | null = null;
    let gemini: GeminiAnalysis | null = null;

    if (USE_MOCK) {
      // Direct mock mode if env is missing
      [watson, gemini] = await Promise.all([
        mockWatson(text),
        mockGemini(text)
      ]);
    } else {
      // Real APIs, but fall back to mock on error
      const [watsonRes, geminiRes] = await Promise.all([
        runWatsonAnalysis(text).catch((err) => {
          console.error("Watson error:", err);
          return null;
        }),
        analyzeWithGemini(text, market, audience).catch((err) => {
          console.error("Gemini error:", err);
          return null;
        })
      ]);

      if (watsonRes) {
        const anyW = watsonRes as any;
        watson = {
          overallScore: safeNumber(
            anyW.overallScore,
            anyW.score ?? 60
          ),
          sentimentLabel:
            anyW.sentimentLabel ?? anyW.label ?? "neutral",
          sentimentScore: safeNumber(
            anyW.sentimentScore,
            anyW.sentiment ?? 0
          ),
          topFlags:
            anyW.topFlags ??
            anyW.flags ??
            ["No explicit flags returned from Watson."]
        };
      }

      if (geminiRes) {
        const anyG = geminiRes as any;
        gemini = {
          overallScore: safeNumber(
            anyG.overallScore,
            anyG.combinedScore ?? anyG.score ?? 65
          ),
          culturalRiskSummary:
            anyG.culturalRiskSummary ??
            anyG.cultureSummary ??
            "No cultural summary returned from Gemini.",
          toneSummary:
            anyG.toneSummary ??
            anyG.tone ??
            "No tone summary returned from Gemini.",
          topRisks:
            anyG.topRisks ??
            anyG.risks ??
            ["No explicit risks returned from Gemini."],
          improvementIdeas:
            anyG.improvementIdeas ??
            anyG.suggestions ??
            ["No improvement suggestions returned from Gemini."]
        };
      }

      // If any side failed, drop back to mock for that side
      if (!watson) {
        watson = await mockWatson(text);
      }
      if (!gemini) {
        gemini = await mockGemini(text);
      }
    }

    // Last safety: never leave them null
    if (!watson) {
      watson = await mockWatson(text || "fallback");
    }
    if (!gemini) {
      gemini = await mockGemini(text || "fallback");
    }

    const overallScore = Math.round(
      (safeNumber(watson.overallScore, 60) +
        safeNumber(gemini.overallScore, 65)) /
        2
    );

    const riskLevel: RiskLevel = getRiskLevel(overallScore);

    const response: AnalysisResult = {
      overallScore,
      riskLevel,
      watson,
      gemini
    };

    return NextResponse.json(response);
  } catch (err) {
    console.error("Analyze API hard failure:", err);

    const watson = await mockWatson(text || "fallback");
    const gemini = await mockGemini(text || "fallback");
    const overallScore = Math.round(
      (watson.overallScore + gemini.overallScore) / 2
    );
    const riskLevel: RiskLevel = getRiskLevel(overallScore);

    const response: AnalysisResult = {
      overallScore,
      riskLevel,
      watson,
      gemini
    };

    return NextResponse.json(response);
  }
}
