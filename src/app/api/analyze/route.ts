// src/app/api/analyze/route.ts
// LocApp AI analyze endpoint – combines Watson + Gemini.
// ASCII-only.

import { NextResponse } from "next/server";
import { runWatsonAnalysis, WatsonResult } from "@/lib/ibmWatson";
import { runGeminiAnalysis, GeminiAnalysis } from "@/lib/geminiClient";

export const runtime = "nodejs";

type RiskLevel = "low" | "medium" | "high";

type WatsonPayload = {
  overallScore: number;
  sentimentLabel: string;
  sentimentScore: number;
  topFlags: string[];
};

type GeminiPayload = {
  overallScore: number;
  culturalRiskSummary: string;
  toneSummary: string;
  topRisks: string[];
  improvementIdeas: string[];
};

type AnalyzeResponse = {
  overallScore: number;
  riskLevel: RiskLevel;
  watson: WatsonPayload;
  gemini: GeminiPayload;
};

function clampScore(value: unknown, fallback: number): number {
  const n = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(n)) return fallback;
  if (n < 0) return 0;
  if (n > 100) return 100;
  return Math.round(n);
}

function getRiskLevel(score: number): RiskLevel {
  if (score < 40) return "low";
  if (score < 70) return "medium";
  return "high";
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const text = typeof body.text === "string" ? body.text : "";

    if (!text.trim()) {
      return NextResponse.json(
        { error: "Missing 'text' in request body." },
        { status: 400 }
      );
    }

    // Optional fields – you already send them, ama boş gelirse default olsun:
    const market =
      typeof body.market === "string" && body.market.trim().length > 0
        ? body.market
        : "Global";
    const audience =
      typeof body.audience === "string" && body.audience.trim().length > 0
        ? body.audience
        : "General decision makers";

    // Run IBM + Gemini in parallel
    let watsonRaw: WatsonResult | null = null;
    let geminiRaw: GeminiAnalysis | null = null;

    await Promise.all([
      (async () => {
        try {
          watsonRaw = await runWatsonAnalysis(text);
        } catch (err) {
          console.error("[Watson] route error:", err);
        }
      })(),
      (async () => {
        try {
          // note: our runGeminiAnalysis currently only takes text
          // if you later extend it with market/audience, add them here
          geminiRaw = await runGeminiAnalysis(text);
        } catch (err) {
          console.error("[Gemini] route error:", err);
        }
      })(),
    ]);

    // Map Watson result
    let watson: WatsonPayload;
    if (watsonRaw) {
      const anyW = watsonRaw as any;
      watson = {
        overallScore: clampScore(anyW.overallScore, 50),
        sentimentLabel: String(anyW.sentimentLabel || "neutral"),
        sentimentScore:
          typeof anyW.sentimentScore === "number"
            ? anyW.sentimentScore
            : 0,
        topFlags: Array.isArray(anyW.topFlags)
          ? anyW.topFlags.map((f: any) => String(f))
          : [],
      };
    } else {
      watson = {
        overallScore: 50,
        sentimentLabel: "neutral",
        sentimentScore: 0,
        topFlags: [
          "Watson analysis failed. Using safe neutral fallback.",
        ],
      };
    }

    // Map Gemini result
    let gemini: GeminiPayload;
    if (geminiRaw) {
      const anyG = geminiRaw as any;
      const topRisks: string[] = Array.isArray(anyG.topRisks)
        ? anyG.topRisks.map((r: any) => String(r))
        : [];
      const improvementIdeas: string[] = Array.isArray(
        anyG.improvementIdeas
      )
        ? anyG.improvementIdeas.map((r: any) => String(r))
        : [];

      gemini = {
        overallScore: clampScore(anyG.overallScore, 55),
        culturalRiskSummary: String(
          anyG.culturalRiskSummary ||
            "No cultural risk summary was returned by the model."
        ),
        toneSummary: String(
          anyG.toneSummary ||
            "No tone-of-voice summary was returned by the model."
        ),
        topRisks:
          topRisks.length > 0
            ? topRisks
            : [
                "The model did not list explicit risks. Review manually for cultural and tone issues.",
              ],
        improvementIdeas:
          improvementIdeas.length > 0
            ? improvementIdeas
            : [
                "Clarify your value proposition and adapt examples to the local market.",
              ],
      };
    } else {
      gemini = {
        overallScore: 55,
        culturalRiskSummary:
          "Cultural and localization analysis is running in fallback mode.",
        toneSummary:
          "Tone-of-voice analysis is running in fallback mode.",
        topRisks: [
          "Some claims may sound generic or not fully localized.",
        ],
        improvementIdeas: [
          "Add market-specific details and reduce over-promising language.",
        ],
      };
    }

    const overallScore = Math.round(
      (watson.overallScore + gemini.overallScore) / 2
    );
    const riskLevel = getRiskLevel(overallScore);

    const payload: AnalyzeResponse = {
      overallScore,
      riskLevel,
      watson,
      gemini,
    };

    return NextResponse.json(payload);
  } catch (err) {
    console.error("[Analyze route] Fatal error:", err);
    return NextResponse.json(
      { error: "Unexpected error while analyzing the text." },
      { status: 500 }
    );
  }
}
