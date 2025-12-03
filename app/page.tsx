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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated Background Orbs */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/30 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl animate-pulse delay-700"></div>
      <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-pink-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-block mb-6">
            <div className="text-6xl mb-4">✨</div>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-300 via-purple-300 to-pink-300 mb-6 tracking-tight">
            LocApp
          </h1>
          <h2 className="text-2xl md:text-3xl font-semibold text-white/90 mb-4">
            AI Text Analyzer for Turkish
          </h2>
          <p className="text-lg text-white/60 max-w-2xl mx-auto">
            Sentiment Analysis, Emotion Detection & Cultural Insights
          </p>
          <p className="text-sm text-white/40 mt-2">
            Powered by IBM Watson NLU & Google Gemini
          </p>
        </div>

        {/* Input Card - Gemini Style */}
        <div className="max-w-5xl mx-auto mb-8">
          <div className="bg-white/5 backdrop-blur-2xl rounded-3xl p-8 border border-white/10 shadow-2xl hover:bg-white/10 transition-all duration-300">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-2 h-2 rounded-full bg-blue-400"></div>
              <label className="text-white/80 text-sm font-medium">
                Enter your text
              </label>
            </div>
            
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Örnek: Bu harika bir ürün! Kesinlikle tavsiye ederim. Çok memnun kaldım..."
              className="w-full h-48 p-6 bg-white/5 backdrop-blur-xl rounded-2xl text-white text-lg placeholder-white/30 resize-none focus:outline-none focus:ring-2 focus:ring-white/20 border border-white/10 transition-all"
            />
            
            <div className="flex gap-3 mt-6">
              <button
                onClick={analyzeText}
                disabled={loading || !text.trim()}
                className="flex-1 bg-gradient-to-r from-blue-500/80 to-purple-600/80 hover:from-blue-500 hover:to-purple-600 backdrop-blur-xl disabled:from-gray-600/50 disabled:to-gray-700/50 text-white font-semibold py-5 px-8 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl disabled:cursor-not-allowed border border-white/10"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-3">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Analyzing...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <span>✨</span>
                    <span>Analyze Text</span>
                  </span>
                )}
              </button>
              
              <button
                onClick={() => { setText(''); setResult(null); }}
                className="px-8 py-5 bg-white/5 hover:bg-white/10 backdrop-blur-xl text-white/80 rounded-2xl transition-all duration-300 border border-white/10"
              >
                Clear
              </button>
            </div>
          </div>
        </div>

        {/* Results Section */}
        {result && !result.error && (
          <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-6">
            {/* IBM Watson Card */}
            {result.ibm && (
              <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 backdrop-blur-2xl rounded-3xl p-8 border border-blue-400/20 shadow-2xl hover:border-blue-400/40 transition-all duration-300">
                <div className="flex items-center gap-3 mb-8">
                  <div className="text-4xl">🧠</div>
                  <div>
                    <h3 className="text-2xl font-bold text-blue-300">IBM Watson</h3>
                    <p className="text-blue-200/60 text-sm">Natural Language Understanding</p>
                  </div>
                </div>
                
                {/* Sentiment */}
                {result.ibm.sentiment && (
                  <div className="mb-6 p-6 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10">
                    <h4 className="text-lg font-semibold text-white/90 mb-4">Sentiment Analysis</h4>
                    <div className="flex items-center gap-4">
                      <span className={`text-5xl ${
                        result.ibm.sentiment.document.label === 'positive' ? 'grayscale-0' :
                        result.ibm.sentiment.document.label === 'negative' ? 'grayscale-0' :
                        'grayscale-0'
                      }`}>
                        {result.ibm.sentiment.document.label === 'positive' ? '😊' :
                         result.ibm.sentiment.document.label === 'negative' ? '😞' : '😐'}
                      </span>
                      <div className="flex-1">
                        <p className="text-white font-bold text-xl capitalize mb-1">
                          {result.ibm.sentiment.document.label}
                        </p>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                            <div 
                              className={`h-full ${
                                result.ibm.sentiment.document.label === 'positive' ? 'bg-green-400' :
                                result.ibm.sentiment.document.label === 'negative' ? 'bg-red-400' :
                                'bg-yellow-400'
                              }`}
                              style={{ width: `${Math.abs(result.ibm.sentiment.document.score || 0) * 100}%` }}
                            ></div>
                          </div>
                          <span className="text-blue-200 text-sm font-medium">
                            {result.ibm.sentiment.document.score?.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Emotions */}
                {result.ibm.emotion && (
                  <div className="p-6 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10">
                    <h4 className="text-lg font-semibold text-white/90 mb-4">Emotion Detection</h4>
                    <div className="grid grid-cols-2 gap-3">
                      {Object.entries(result.ibm.emotion.document.emotion).map(([emotion, score]: [string, any]) => (
                        <div key={emotion} className="p-4 bg-white/5 rounded-xl border border-white/5 hover:bg-white/10 transition-all">
                          <div className="text-3xl mb-2">
                            {emotion === 'joy' && '😄'}
                            {emotion === 'sadness' && '😢'}
                            {emotion === 'anger' && '😠'}
                            {emotion === 'fear' && '😨'}
                            {emotion === 'disgust' && '🤢'}
                          </div>
                          <p className="text-white/70 text-xs font-medium capitalize mb-1">{emotion}</p>
                          <p className="text-blue-300 text-lg font-bold">{(score * 100).toFixed(0)}%</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Gemini Card */}
            {result.gemini && (
              <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 backdrop-blur-2xl rounded-3xl p-8 border border-purple-400/20 shadow-2xl hover:border-purple-400/40 transition-all duration-300">
                <div className="flex items-center gap-3 mb-8">
                  <div className="text-4xl">✨</div>
                  <div>
                    <h3 className="text-2xl font-bold text-purple-300">Google Gemini</h3>
                    <p className="text-purple-200/60 text-sm">Cultural Intelligence</p>
                  </div>
                </div>
                <div className="p-6 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10">
                  <pre className="text-sm text-gray-200 whitespace-pre-wrap leading-relaxed font-mono">
                    {result.gemini}
                  </pre>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Error Card */}
        {result?.error && (
          <div className="max-w-3xl mx-auto bg-gradient-to-br from-red-500/10 to-orange-500/10 backdrop-blur-2xl rounded-3xl p-8 border border-red-400/20 shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-4xl">⚠️</span>
              <h3 className="text-2xl font-bold text-red-300">Analysis Error</h3>
            </div>
            <p className="text-red-200/80 text-lg mb-4">{result.error}</p>
            {result.details && (
              <pre className="text-sm text-red-300/60 bg-black/20 p-4 rounded-xl overflow-auto border border-red-400/10">
                {result.details}
              </pre>
            )}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="relative z-10 text-center py-8 mt-16">
        <div className="inline-block px-6 py-3 bg-white/5 backdrop-blur-xl rounded-full border border-white/10">
          <p className="text-white/60 text-sm">
            © 2025 LocApp • Turkish AI Text Analyzer
          </p>
        </div>
      </div>
    </div>
  );
}