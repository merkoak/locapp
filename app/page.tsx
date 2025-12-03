'use client';

import { useState } from 'react';

export default function Home() {
  const [text, setText] = useState('');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const analyzeText = async () => {
    if (!text.trim()) return;
    
    setLoading(true);
    setResult(null);

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });

      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error('Analysis error:', error);
      setResult({ error: 'Analysis failed' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 mb-4">
            LocAI Hybrid Motor
          </h1>
          <p className="text-gray-300 text-lg">
            Turkish Text Analysis • IBM NLU + Google Gemini
          </p>
        </div>

        {/* Main Content */}
        <div className="max-w-5xl mx-auto">
          {/* Input Section */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-white/20 mb-8">
            <label className="block text-white text-sm font-semibold mb-3">
              📝 Enter Turkish Text for Analysis
            </label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Örnek: Bu harika bir ürün! Kesinlikle tavsiye ederim..."
              className="w-full h-40 p-4 bg-slate-800/50 backdrop-blur rounded-xl text-white placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-purple-500 border border-white/10 transition"
            />
            
            <div className="flex gap-4 mt-6">
              <button
                onClick={analyzeText}
                disabled={loading || !text.trim()}
                className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-bold py-4 rounded-xl transition transform hover:scale-105 disabled:scale-100 shadow-lg"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Analyzing...
                  </span>
                ) : (
                  '🚀 Analyze Text'
                )}
              </button>
              
              <button
                onClick={() => { setText(''); setResult(null); }}
                className="px-8 py-4 bg-slate-700/50 hover:bg-slate-600/50 text-white rounded-xl transition"
              >
                🗑️ Clear
              </button>
            </div>
          </div>

          {/* Results Section */}
          {result && !result.error && (
            <div className="space-y-6">
              {/* IBM Watson Results */}
              {result.ibm && (
                <div className="bg-gradient-to-br from-blue-900/40 to-blue-800/40 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-blue-400/30">
                  <h2 className="text-3xl font-bold text-blue-300 mb-6 flex items-center gap-3">
                    <span className="text-4xl">🧠</span> IBM Watson NLU
                  </h2>
                  
                  {/* Sentiment */}
                  {result.ibm.sentiment && (
                    <div className="mb-6 p-6 bg-white/5 rounded-xl">
                      <h3 className="text-xl font-semibold text-white mb-3">Sentiment Analysis</h3>
                      <div className="flex items-center gap-4">
                        <span className={`text-3xl ${
                          result.ibm.sentiment.document.label === 'positive' ? 'text-green-400' :
                          result.ibm.sentiment.document.label === 'negative' ? 'text-red-400' :
                          'text-yellow-400'
                        }`}>
                          {result.ibm.sentiment.document.label === 'positive' ? '😊' :
                           result.ibm.sentiment.document.label === 'negative' ? '😞' : '😐'}
                        </span>
                        <div>
                          <p className="text-white font-bold text-lg capitalize">
                            {result.ibm.sentiment.document.label}
                          </p>
                          <p className="text-blue-200">
                            Score: {result.ibm.sentiment.document.score?.toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Emotions */}
                  {result.ibm.emotion && (
                    <div className="p-6 bg-white/5 rounded-xl">
                      <h3 className="text-xl font-semibold text-white mb-4">Emotion Detection</h3>
                      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                        {Object.entries(result.ibm.emotion.document.emotion).map(([emotion, score]: [string, any]) => (
                          <div key={emotion} className="text-center p-4 bg-white/5 rounded-lg">
                            <div className="text-3xl mb-2">
                              {emotion === 'joy' && '😄'}
                              {emotion === 'sadness' && '😢'}
                              {emotion === 'anger' && '😠'}
                              {emotion === 'fear' && '😨'}
                              {emotion === 'disgust' && '🤢'}
                            </div>
                            <p className="text-white text-sm font-semibold capitalize">{emotion}</p>
                            <p className="text-blue-300 text-lg font-bold">{(score * 100).toFixed(0)}%</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Google Gemini Results */}
              {result.gemini && (
                <div className="bg-gradient-to-br from-purple-900/40 to-pink-800/40 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-purple-400/30">
                  <h2 className="text-3xl font-bold text-purple-300 mb-6 flex items-center gap-3">
                    <span className="text-4xl">✨</span> Google Gemini AI
                  </h2>
                  <div className="prose prose-invert max-w-none">
                    <pre className="bg-white/5 p-6 rounded-xl overflow-auto text-sm text-gray-200 whitespace-pre-wrap">
                      {result.gemini}
                    </pre>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Error Display */}
          {result?.error && (
            <div className="bg-red-900/40 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-red-400/30">
              <h2 className="text-2xl font-bold text-red-300 mb-4">❌ Error</h2>
              <p className="text-red-200">{result.error}</p>
              {result.details && (
                <pre className="mt-4 text-sm text-red-300 bg-black/20 p-4 rounded overflow-auto">
                  {result.details}
                </pre>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="text-center py-8 text-gray-400 text-sm">
        <p>Powered by IBM Watson NLU & Google Gemini • Built with Next.js & TypeScript</p>
      </div>
    </div>
  );
}