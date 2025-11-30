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
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center">
          LocAI Hybrid Motor
        </h1>
        
        <div className="bg-gray-800 rounded-lg p-6 mb-6">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Analyze edilecek Turkce metni girin..."
            className="w-full h-32 p-4 bg-gray-700 rounded text-white resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          
          <button
            onClick={analyzeText}
            disabled={loading || !text.trim()}
            className="mt-4 w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 py-3 rounded font-semibold transition"
          >
            {loading ? 'Analyzing...' : 'Analyze'}
          </button>
        </div>

        {result && (
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-4">Results</h2>
            <pre className="bg-gray-900 p-4 rounded overflow-auto text-sm">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}