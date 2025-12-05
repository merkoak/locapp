// src/app/api/analyze/route.ts
import { NextRequest, NextResponse } from "next/server";
import { runWatsonAnalysis } from "@/lib/ibmWatson";
import { analyzeWithGemini } from "@/lib/geminiClient";

type AnalyzeBody = {
  text: string;
  market?: string;
  audience?: string;
};

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as AnalyzeBody;
    const { text, market, audience } = body;

    if (!text || typeof text !== "string") {
      return NextResponse.json(
        { error: "Missing or invalid 'text' field" },
        { status: 400 }
      );
    }

    // Run both "brains" in parallel
    const [watsonResult, geminiResult] = await Promise.all([
      runWatsonAnalysis(text),
      analyzeWithGemini({ text, market, audience }),
    ]);

    const watsonScore = watsonResult.overallScore;
    const geminiScore = geminiResult.overallScore;
    const overallScore = Math.round((watsonScore + geminiScore) / 2);

    const riskLevel =
      overallScore >= 85 ? "low" : overallScore >= 70 ? "medium" : "high";

    return NextResponse.json(
      {
        overallScore,
        riskLevel,
        watson: watsonResult,
        gemini: geminiResult,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("/api/analyze error", error);
    return NextResponse.json(
      { error: "Unexpected error while analyzing the text" },
      { status: 500 }
    );
  }
}
