import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import NaturalLanguageUnderstandingV1 from 'ibm-watson/natural-language-understanding/v1';
import { IamAuthenticator } from 'ibm-watson/auth';

// Servisleri globalde başlat, hata vermesin diye try-catch içine veya boş kontrole gerek yok,
// çünkü çağırırken kontrol edeceğiz.
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

// IBM servisi bazen boş key ile init olduğunda hata atabilir, opsiyonel bırakıyoruz.
let nlu: NaturalLanguageUnderstandingV1 | null = null;
if (process.env.IBM_API_KEY && process.env.IBM_SERVICE_URL) {
  try {
    nlu = new NaturalLanguageUnderstandingV1({
      version: '2022-04-07',
      authenticator: new IamAuthenticator({
        apikey: process.env.IBM_API_KEY,
      }),
      serviceUrl: process.env.IBM_SERVICE_URL,
    });
  } catch (err) {
    console.warn('IBM Watson başlatılamadı:', err);
  }
}

// Gemini çıktısını temizleyen yardımcı fonksiyon
function cleanAndParseJSON(text: string) {
  try {
    // Markdown taglerini temizle (```json ve ``` kısımlarını siler)
    const cleanedText = text.replace(/```json|```/g, '').trim();
    return JSON.parse(cleanedText);
  } catch (e) {
    console.error('JSON Parse Hatası:', e);
    // Parse edilemezse raw text döner
    return { raw_text: text, error: 'Could not parse JSON' };
  }
}

export async function POST(request: NextRequest) {
  try {
    const { text } = await request.json();

    if (!text || text.trim().length === 0) {
      return NextResponse.json(
        { error: 'Text input is required' },
        { status: 400 }
      );
    }

    // İki servisi birbirinden bağımsız çalıştır (Biri patlasa da diğeri dönsün)
    const [geminiResult, ibmResult] = await Promise.allSettled([
      analyzeWithGemini(text),
      analyzeWithIBM(text),
    ]);

    // Sonuçları işle
    const responseData = {
      gemini: geminiResult.