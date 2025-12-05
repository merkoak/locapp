// src/lib/ibmWatson.ts
// ASCII-only helper for IBM Watson NLU sentiment analysis.

import NaturalLanguageUnderstandingV1 from "ibm-watson/natural-language-understanding/v1";
import { IamAuthenticator } from "ibm-cloud-sdk-core";

const IBM_API_KEY = process.env.IBM_API_KEY || "";
const IBM_API_URL = process.env.IBM_API_URL || "";

let nluClient: NaturalLanguageUnderstandingV1 | null = null;

function getClient(): NaturalLanguageUnderstandingV1 {
  if (!IBM_API_KEY || !IBM_API_URL) {
    throw new Error("IBM_API_KEY or IBM_API_URL is not set.");
  }

  if (!nluClient) {
    nluClient = new NaturalLanguageUnderstandingV1({
      version: "2022-04-07",
      authenticator: new IamAuthenticator({
        apikey: IBM_API_KEY,
      }),
      serviceUrl: IBM_API_URL,
    });
  }

  return nluClient;
}

function scaleSentimentToScore(score: number): number {
  // Watson gives -1..1, we convert to 0..100
  const clamped = Math.max(-1, Math.min(1, score));
  return Math.round((clamped + 1) * 50);
}

export async function runWatsonAnalysis(text: string) {
  const client = getClient();

  const response = await client.analyze({
    text,
    features: {
      sentiment: {},
      emotion: {},
    },
    // Mostly English marketing copy now; we can change later if needed.
    language: "en",
  });

  const result: any = response.result || {};
  const sentimentDoc = result.sentiment?.document || {};
  const emotionDoc = result.emotion?.document?.emotion || {};

  const sentimentScore = typeof sentimentDoc.score === "number"
    ? sentimentDoc.score
    : 0;

  const sentimentLabel: "positive" | "neutral" | "negative" =
    sentimentDoc.label === "positive" ||
    sentimentDoc.label === "neutral" ||
    sentimentDoc.label === "negative"
      ? sentimentDoc.label
      : "neutral";

  const overallScore = scaleSentimentToScore(sentimentScore);

  const flags: string[] = [];

  if (sentimentScore > 0.6) {
    flags.push("Copy sounds very enthusiastic. Check for over-promising claims.");
  }
  if (sentimentScore < -0.4) {
    flags.push("Copy feels quite negative. This might not be ideal for marketing.");
  }
  if ((emotionDoc.joy ?? 0) > 0.7) {
    flags.push("Very high joy emotion detected; ensure it still sounds credible.");
  }
  if ((emotionDoc.anger ?? 0) > 0.4) {
    flags.push("Noticeable anger detected; review tone carefully.");
  }

  if (flags.length === 0) {
    flags.push("No major sentiment issues detected by Watson.");
  }

  return {
    overallScore,
    sentimentLabel,
    sentimentScore,
    topFlags: flags,
  };
}
