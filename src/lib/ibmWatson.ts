// src/lib/ibmWatson.ts
// ASCII-only.

import NaturalLanguageUnderstandingV1 from "ibm-watson/natural-language-understanding/v1";
import { IamAuthenticator } from "ibm-watson/auth";

const IBM_API_KEY = process.env.IBM_API_KEY;
const IBM_SERVICE_URL = process.env.IBM_SERVICE_URL;

export type WatsonResult = {
  overallScore: number;        // 0–100
  sentimentLabel: string;      // positive | negative | neutral | mixed
  sentimentScore: number;      // raw -1..1
  topFlags: string[];
};

function buildMockWatson(): WatsonResult {
  return {
    overallScore: 50,
    sentimentLabel: "neutral",
    sentimentScore: 0.05,
    topFlags: [
      "Mock mode: Watson API is not configured or failed.",
      "Connect IBM NLU credentials in .env.local for real sentiment analysis.",
    ],
  };
}

export async function runWatsonAnalysis(
  text: string
): Promise<WatsonResult> {
  if (!text || !text.trim()) {
    return {
      overallScore: 50,
      sentimentLabel: "neutral",
      sentimentScore: 0,
      topFlags: ["No text provided for sentiment analysis."],
    };
  }

  if (!IBM_API_KEY || !IBM_SERVICE_URL) {
    console.warn(
      "[Watson] Missing IBM_API_KEY or IBM_SERVICE_URL. Using mock Watson analysis."
    );
    return buildMockWatson();
  }

  try {
    const nlu = new NaturalLanguageUnderstandingV1({
      version: "2021-08-01",
      authenticator: new IamAuthenticator({ apikey: IBM_API_KEY }),
      serviceUrl: IBM_SERVICE_URL,
    });

    const res = await nlu.analyze({
      text,
      features: { sentiment: {} },
      // IBM language auto-detect yapabiliyor ama dün de böyle kullanıyorduk:
      language: "en",
    });

    const doc = res.result.sentiment?.document;
    const rawScore =
      typeof doc?.score === "number" ? doc.score : 0;

    // -1..1 -> 0..100
    let overallScore = Math.round(((rawScore + 1) / 2) * 100);
    if (overallScore < 0) overallScore = 0;
    if (overallScore > 100) overallScore = 100;

    const sentimentLabel = doc?.label ?? "neutral";

    const topFlags: string[] = [];

    if (Math.abs(rawScore) < 0.15) {
      topFlags.push(
        "No major sentiment issues detected by Watson for this text."
      );
    } else if (rawScore > 0.15) {
      topFlags.push(
        "Message leans positive and may sound slightly over-promising in some contexts."
      );
    } else {
      topFlags.push(
        "Message leans negative and may feel too alarming for some audiences."
      );
    }

    return {
      overallScore,
      sentimentLabel,
      sentimentScore: rawScore,
      topFlags,
    };
  } catch (err) {
    console.error("[Watson] API error, falling back to mock:", err);
    const mock = buildMockWatson();
    mock.topFlags.unshift(
      "Mock mode: Watson API call failed. Using local fallback."
    );
    return mock;
  }
}
