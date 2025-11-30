import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import NaturalLanguageUnderstandingV1 from 'ibm-watson/natural-language-understanding/v1';
import { IamAuthenticator } from 'ibm-watson/auth';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

const nlu = new NaturalLanguageUnderstandingV1({
  version: '2022-04-07',
  authenticator: new IamAuthenticator({
    apikey: process.env.IBM_API_KEY || '',
  }),
  serviceUrl: process.env.IBM_SERVICE_URL || '',
});

export async function POST(request: NextRequest) {
  try {
    const { text } = await request.json();

    if (!text || text.trim().length === 0) {
      return NextResponse.json(
        { error: 'Text input is required' },
        { status: 400 }
      );
    }

    const [geminiResult, ibmResult] = await Promise.all([
      analyzeWithGemini(text),
      analyzeWithIBM(text),
    ]);

    return NextResponse.json({
      gemini: geminiResult,
      ibm: ibmResult,
    });
  } catch (error) {
    console.error('Analysis error:', error);
    return NextResponse.json(
      { error: 'Analysis failed', details: String(error) },
      { status: 500 }
    );
  }
}

async function analyzeWithGemini(text: string) {
  const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
  
  const prompt = `Analyze the cultural and institutional tone of this Turkish text. Provide:
1. Formality level (formal/informal/mixed)
2. Cultural context (traditional/modern/neutral)
3. Institutional tone (corporate/academic/casual/official)
4. Key cultural markers

Text: "${text}"

Respond in JSON format.`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  return response.text();
}

async function analyzeWithIBM(text: string) {
  const params = {
    text: text,
    features: {
      sentiment: {},
      emotion: {},
    },
    language: 'tr',
  };

  const response = await nlu.analyze(params);
  return response.result;
}