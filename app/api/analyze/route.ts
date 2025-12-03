import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import NaturalLanguageUnderstandingV1 from 'ibm-watson/natural-language-understanding/v1';
import { IamAuthenticator } from 'ibm-watson/auth';

// 1. SERVİS İLK BAŞLATMA
// API Key'leriniz eksikse, runtime hatası (500) almamak için opsiyonel başlatma.
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

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

// 2. YARDIMCI FONKSİYONLAR

// Gemini çıktısını temizleyip JSON'a dönüştüren fonksiyon
function cleanAndParseJSON(text: string) {
  try {
    // Önceki hatanın sebebi olan Markdown taglerini temizle (```json ve ``` kısımlarını siler)
    const cleanedText = text.replace(/```json|```/g, '').trim();
    return JSON.parse(cleanedText);
  } catch (e) {
    console.error('JSON Parse Hatası:', e);
    // Parse edilemezse hata objesi döner
    return { raw_text: text, error: 'Could not parse JSON' };
  }
}

async function analyzeWithGemini(text: string) {
  if (!process.env.GEMINI_API_KEY) throw new Error("Gemini API Key missing");
  
  const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
  
  const prompt = `Analyze the cultural and institutional tone of this Turkish text. 
  Text: "${text}"
  
  Provide a strictly valid JSON response with these keys:
  {
    "formality_level": "formal/informal/mixed",
    "cultural_context": "traditional/modern/neutral",
    "institutional_tone": "corporate/academic/casual/official",
    "key_cultural_markers": ["marker1", "marker2"]
  }
  Do not write any intro text, just the JSON.`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const rawText = response.text();
  
  // Temizleyip parse ederek dönüyoruz
  return cleanAndParseJSON(rawText);
}

async function analyzeWithIBM(text: string) {
  if (!nlu) {
    throw new Error("IBM Service not initialized or API keys missing");
  }

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

// 3. ANA API HANDLER

export async function POST(request: NextRequest) {
  try {
    const { text } = await request.json();

    if (!text || text.trim().length === 0) {
      return NextResponse.json(
        { error: 'Text input is required' },
        { status: 400 }
      );
    }

    // Promise.allSettled: Biri hata verse bile diğerinin sonucunu almanızı sağlar (Robust çözüm)
    const [geminiResult, ibmResult] = await Promise.allSettled([
      analyzeWithGemini(text),
      analyzeWithIBM(text),
    ]);

    // Sonuçları işle - Hata durumunda bile diğer başarılı sonucu döndürür.
    const responseData = {
      // Turbopack hatasını veren kod parçası (şimdi tamamlandı)
      gemini: geminiResult.status === 'fulfilled' ? geminiResult.value : { error: 'Gemini analysis failed' },
      ibm: ibmResult.status === 'fulfilled' ? ibmResult.value : { error: 'IBM analysis failed or not configured' },
    };

    return NextResponse.json(responseData);

  } catch (error) {
    console.error('General Analysis error:', error);
    return NextResponse.json(
      { error: 'Analysis failed', details: String(error) },
      { status: 500 }
    );
  }
}