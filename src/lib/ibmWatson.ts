// src/lib/ibmWatson.ts
// IBM Watson NLU sentiment wrapper (ASCII only)

import NaturalLanguageUnderstandingV1 from "ibm-watson/natural-language-understanding/v1";
import { IamAuthenticator } from "ibm-watson/auth";

export type WatsonAnalysis = {
  overallScore: number;
  sentimentLabel: "positive" | "neutral" | "negative";
  sentimentScore: number;
  topFlags: string[];
};

const apiKey = process.env.IBM_API_KEY;
const apiUrl = process.env.IBM_API_URL;

if (!apiKey || !apiUrl) {
  // Do not crash build; runtime will fall back to mock.
  console.warn("IBM Watson env vars are missing. Using mock sentiment.");
}

const nlu =
  apiKey && apiUrl
    ? new NaturalLanguageUnderstandingV1({
        version: "2023-10-01",
        authenticator: new IamAuthenticator({
          apikey: apiKey,
        }),
        serviceUrl: apiUrl,
      })
    : null;

export async function runWatsonAnalysis(
  text: string
): Promise<WatsonAnalysis> {
  // Fallback mock if env is not configured
  if (!nlu) {
    return {
      overallScore: 55,
      sentimentLabel: "neutral",
      sentimentScore: 0,
      topFlags: ["IBM Watson is not configured; using mock sentiment."],
    };
  }

  const res = await nlu.analyze({
    text,
    fea
