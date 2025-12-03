// src/lib/ibmWatson.ts
// Mock IBM Watson sentiment + safety analysis
// No external SDK or API key required.

export type WatsonAnalysis = {
  overallScore: number; // 0-100
  sentimentLabel: "positive" | "neutral" | "negative";
  sentimentScore: number; // -1..1
  topFlags: string[];
};

function scoreFromText(text: string): number {
  // Very naive, deterministic-ish score based on length
  const len = text.length;
  if (len < 40) return 55;
  if (len < 120) return 72;
  if (len < 300) return 82;
  return 78;
}

export async function runWatsonAnalysis(text: string): Promise<WatsonAnalysis> {
  const baseScore = scoreFromText(text);

  // Fake sentiment based on presence of some keywords
  const lower = text.toLowerCase();
  let sentimentScore = 0;
  let sentimentLabel: WatsonAnalysis["sentimentLabel"] = "neutral";

  if (lower.includes("hate") || lower.includes("terrible")) {
    sentimentScore = -0.7;
    sentimentLabel = "negative";
  } else if (lower.includes("love") || lower.includes("amazing")) {
    sentimentScore = 0.8;
    sentimentLabel = "positive";
  } else {
    sentimentScore = 0;
    sentimentLabel = "neutral";
  }

  const topFlags: string[] = [];
  if (sentimentLabel === "negative") {
    topFlags.push("Message feels negative or harsh.");
  }
  if (sentimentLabel === "positive" && sentimentScore > 0.7) {
    topFlags.push("Message may sound over-promising.");
  }
  if (topFlags.length === 0) {
    topFlags.push("No major sentiment issues detected.");
  }

  return {
    overallScore: baseScore,
    sentimentLabel,
    sentimentScore,
    topFlags,
  };
}
