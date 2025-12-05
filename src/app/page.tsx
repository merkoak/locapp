// src/app/page.tsx
"use client";

import { useState } from "react";
import type { FormEvent } from "react";

type AnalyzeResponse = {
  overallScore: number;
  riskLevel: "low" | "medium" | "high";
  watson: {
    overallScore: number;
    sentimentLabel: string;
    sentimentScore: number;
    topFlags: string[];
  };
  gemini: {
    overallScore: number;
    culturalRiskSummary: string;
    toneSummary: string;
    topRisks: string[];
    improvementIdeas: string[];
  };
};

export default function HomePage() {
  const [text, setText] = useState("");
  const [market, setMarket] = useState("Turkey");
  const [audience, setAudience] = useState("general");
  const [email, setEmail] = useState("");
  const [leadCaptured, setLeadCaptured] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<AnalyzeResponse | null>(null);

  const hasCriticalRisk =
    data?.overallScore != null && data.overallScore < 70;

  async function handleAnalyze() {
    setLoading(true);
    setError(null);
    setData(null);

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text,
          market,
          audience,
        }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "Request failed");
      }

      const json = (await res.json()) as AnalyzeResponse;
      setData(json);
    } catch (err: any) {
      setError(err.message || "Unexpected error");
    } finally {
      setLoading(false);
    }
  }

  function handleLeadSubmit(e: FormEvent) {
    e.preventDefault();
    if (!email) return;
    // TODO: connect to real lead API (Babil Agency)
    setLeadCaptured(true);
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[#050816] via-[#110827] to-[#20003c] text-slate-100 flex flex-col items-center px-4 md:px-6 py-10">
      {/* Liquid glass / neon glow background blobs */}
      <div className="pointer-events-none absolute -top-40 -left-32 h-80 w-80 rounded-full bg-fuchsia-500/35 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -right-32 h-96 w-96 rounded-full bg-cyan-400/30 blur-3xl" />
      <div className="pointer-events-none absolute top-1/3 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-violet-500/22 blur-3xl" />

      {/* Subtle grid overlay */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.18] [background-image:linear-gradient(to_right,rgba(148,163,184,0.22)_1px,transparent_1px),linear-gradient(to_bottom,rgba(148,163,184,0.16)_1px,transparent_1px)] [background-size:90px_90px]" />

      <div className="relative w-full max-w-6xl space-y-9">
        {/* Hero */}
        <header className="flex flex-col gap-4 text-center">
          <div className="inline-flex items-center justify-center gap-2 mx-auto rounded-full border border-fuchsia-400/40 bg-white/10 px-4 py-1.5 text-[11px] md:text-xs uppercase tracking-[0.18em] text-fuchsia-100/90 shadow-[0_0_28px_rgba(236,72,153,0.4)] backdrop-blur-xl">
            <span className="h-1.5 w-1.5 rounded-full bg-fuchsia-400 animate-pulse" />
            LocAI · Cultural risk radar
          </div>
          <h1 className="text-3xl md:text-5xl font-semibold tracking-tight bg-gradient-to-r from-fuchsia-200 via-cyan-100 to-violet-200 bg-clip-text text-transparent">
            Audit your copy before culture does.
          </h1>
          <p className="text-sm md:text-lg text-slate-200/85 max-w-3xl mx-auto">
            Paste your English marketing or product copy. LocAI runs sentiment and
            cultural analysis in parallel and flags risks before your launch hits
            the wrong nerve.
          </p>
        </header>

        {/* Top: input + lead capture */}
        <section className="grid gap-5 md:grid-cols-[2fr,1fr]">
          {/* Input card */}
          <div className="relative rounded-3xl">
            {/* Gradient border wrapper */}
            <div className="absolute inset-[1px] rounded-[26px] bg-gradient-to-br from-fuchsia-500/65 via-violet-500/40 to-cyan-400/60 opacity-80 blur-[3px]" />
            <div className="relative rounded-[26px] border border-white/18 bg-slate-950/65 bg-clip-padding backdrop-blur-2xl shadow-[0_20px_60px_rgba(15,23,42,0.95)] px-5 py-5 md:px-7 md:py-7 flex flex-col gap-5">
              <label className="text-xs md:text-sm font-medium uppercase tracking-[0.18em] text-slate-300/90">
                Text to audit
              </label>
              <textarea
                className="w-full min-h-[200px] rounded-2xl bg-slate-900/70 border border-white/12 px-3.5 py-3 text-sm md:text-base outline-none focus:ring-2 focus:ring-fuchsia-500/80 focus:border-fuchsia-400/80 resize-vertical placeholder:text-slate-500/80 shadow-[0_0_0_1px_rgba(255,255,255,0.04)]"
                placeholder="Paste your English copy here..."
                value={text}
                onChange={(e) => setText(e.target.value)}
              />

              <div className="grid grid-cols-2 gap-4 text-xs md:text-sm">
                <div className="flex flex-col gap-1.5">
                  <span className="text-slate-300/90">Focus market</span>
                  <input
                    className="rounded-xl bg-slate-900/70 border border-white/12 px-3 py-2 text-xs md:text-sm outline-none focus:ring-2 focus:ring-fuchsia-500/80 focus:border-fuchsia-400/80 shadow-[0_0_0_1px_rgba(255,255,255,0.04)]"
                    value={market}
                    onChange={(e) => setMarket(e.target.value)}
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <span className="text-slate-300/90">Audience</span>
                  <input
                    className="rounded-xl bg-slate-900/70 border border-white/12 px-3 py-2 text-xs md:text-sm outline-none focus:ring-2 focus:ring-fuchsia-500/80 focus:border-fuchsia-400/80 shadow-[0_0_0_1px_rgba(255,255,255,0.04)]"
                    value={audience}
                    onChange={(e) => setAudience(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex flex-col md:flex-row md:items-center gap-4 justify-between">
                <button
                  onClick={handleAnalyze}
                  disabled={!text || loading}
                  className="inline-flex items-center justify-center rounded-2xl px-5 py-2.5 text-sm md:text-base font-medium bg-gradient-to-r from-fuchsia-500 via-violet-500 to-cyan-400 hover:from-fuchsia-400 hover:via-violet-400 hover:to-cyan-300 disabled:opacity-40 disabled:cursor-not-allowed shadow-[0_16px_40px_rgba(129,140,248,0.65)] transition-transform duration-150 active:scale-[0.97]"
                >
                  {loading ? "Analyzing..." : "Run risk audit"}
                </button>

                <p className="text-[11px] md:text-xs text-slate-300/85 max-w-sm md:max-w-md">
                  LocAI does not translate. It detects tonal and cultural risk and
                  tells you when it&apos;s safer to hand off to Babil Agency.
                </p>
              </div>

              {error && (
                <p className="text-xs md:text-sm text-rose-200 bg-rose-950/70 border border-rose-500/50 rounded-xl px-3 py-2 mt-1">
                  {error}
                </p>
              )}
            </div>
          </div>

          {/* Lead capture */}
          <aside className="relative">
            <div className="absolute inset-[1px] rounded-[26px] bg-gradient-to-br from-violet-500/60 via-fuchsia-500/45 to-cyan-400/50 opacity-80 blur-[3px]" />
            <div className="relative rounded-[26px] border border-white/18 bg-slate-950/70 bg-clip-padding backdrop-blur-2xl shadow-[0_20px_60px_rgba(15,23,42,0.95)] px-4 py-5 md:px-6 md:py-6 flex flex-col gap-4">
              <h2 className="text-sm md:text-base font-semibold tracking-tight text-slate-50">
                Full report unlock
              </h2>
              <p className="text-xs md:text-sm text-slate-200/85">
                Save your work email to get early access to deep-dive LocAI
                reports and human localization support from Babil Agency.
              </p>
              <form onSubmit={handleLeadSubmit} className="space-y-3 md:space-y-4">
                <div className="flex flex-col gap-1.5 text-xs md:text-sm">
                  <span className="text-slate-300/90">Work email</span>
                  <input
                    type="email"
                    required
                    className="rounded-xl bg-slate-900/70 border border-white/12 px-3 py-2 text-xs md:text-sm outline-none focus:ring-2 focus:ring-fuchsia-500/80 focus:border-fuchsia-400/80 shadow-[0_0_0_1px_rgba(255,255,255,0.04)]"
                    placeholder="you@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <button
                  type="submit"
                  className="w-full rounded-2xl px-4 py-2.5 text-xs md:text-sm font-medium bg-gradient-to-r from-fuchsia-500 via-violet-500 to-cyan-400 hover:from-fuchsia-400 hover:via-violet-400 hover:to-cyan-300 shadow-[0_14px_36px_rgba(236,72,153,0.6)] transition-transform duration-150 active:scale-[0.97]"
                >
                  {leadCaptured
                    ? "Email saved – rerun audit for fuller view"
                    : "Save email for full reports"}
                </button>
              </form>
              <p className="text-[10px] md:text-[11px] text-slate-300/85">
                LocAI is your radar; Babil Agency is the response team when the
                risk is real.
              </p>
            </div>
          </aside>
        </section>

        {/* Results */}
        {data && (
          <section className="space-y-5 md:space-y-6">
            {/* Overall banner */}
            <div
              className={`relative rounded-3xl border px-4 py-4 md:px-7 md:py-5 flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-6 bg-clip-padding backdrop-blur-2xl shadow-[0_20px_60px_rgba(15,23,42,0.95)] ${
                hasCriticalRisk
                  ? "border-rose-500/70 bg-gradient-to-r from-rose-900/85 via-rose-950/95 to-slate-950/95"
                  : data.riskLevel === "medium"
                  ? "border-amber-400/70 bg-gradient-to-r from-amber-900/85 via-slate-950/95 to-slate-950/95"
                  : "border-emerald-400/70 bg-gradient-to-r from-emerald-900/85 via-slate-950/95 to-slate-950/95"
              }`}
            >
              <div className="flex flex-col gap-1.5 md:gap-2">
                <span className="text-[11px] md:text-xs uppercase tracking-[0.2em] text-slate-300/85">
                  Overall cultural safety score
                </span>
                <div className="flex items-baseline gap-2 md:gap-3">
                  <span className="text-3xl md:text-4xl font-semibold text-slate-50">
                    {data.overallScore}
                  </span>
                  <span className="text-xs md:text-sm uppercase tracking-wide text-slate-200/90">
                    / 100
                  </span>
                  <span className="text-[11px] md:text-xs px-3 py-1 rounded-full border border-white/45 bg-black/40 text-slate-50">
                    {data.riskLevel === "low"
                      ? "Low risk"
                      : data.riskLevel === "medium"
                      ? "Attention needed"
                      : "Critical risk"}
                  </span>
                </div>
                {hasCriticalRisk ? (
                  <p className="text-xs md:text-sm max-w-2xl text-slate-100/90">
                    LocAI detects critical cultural or tonal risks. We strongly
                    recommend urgent human review. Babil Agency can redesign this
                    message before it reaches your audience.
                  </p>
                ) : data.riskLevel === "medium" ? (
                  <p className="text-xs md:text-sm max-w-2xl text-slate-100/90">
                    Your copy is usable but carries noticeable risks. A focused
                    localization pass can unlock safer, higher-conversion
                    messaging for your key markets.
                  </p>
                ) : (
                  <p className="text-xs md:text-sm max-w-2xl text-slate-100/90">
                    Your copy looks relatively safe. You can still localize it for
                    stronger resonance, higher trust, and better performance.
                  </p>
                )}
              </div>

              <div className="flex flex-col items-end gap-1.5 text-right">
                {hasCriticalRisk && (
                  <a
                    href="https://babil.com"
                    className="inline-flex items-center justify-center rounded-2xl px-4 md:px-5 py-2 text-xs md:text-sm font-semibold bg-gradient-to-r from-rose-500 via-amber-400 to-rose-400 hover:from-rose-400 hover:via-amber-300 hover:to-rose-300 shadow-[0_14px_40px_rgba(248,113,113,0.85)]"
                  >
                    Urgent: Talk to Babil Agency
                  </a>
                )}
                {!hasCriticalRisk && (
                  <a
                    href="https://babil.com"
                    className="inline-flex items-center justify-center rounded-2xl px-4 md:px-5 py-2 text-xs md:text-sm font-semibold bg-gradient-to-r from-fuchsia-500 via-violet-500 to-cyan-400 hover:from-fuchsia-400 hover:via-violet-400 hover:to-cyan-300 shadow-[0_14px_40px_rgba(59,130,246,0.75)]"
                  >
                    Improve with Babil Agency
                  </a>
                )}
                <span className="text-[10px] md:text-[11px] text-slate-200/85">
                  LocAI is a risk radar. Babil Agency is the human solution.
                </span>
              </div>
            </div>

            {/* Two result cards */}
            <div className="grid gap-5 md:grid-cols-2">
              {/* Sentiment card */}
              <div className="relative">
                <div className="absolute inset-[1px] rounded-[26px] bg-gradient-to-br from-sky-500/35 via-indigo-500/35 to-fuchsia-500/35 opacity-80 blur-[3px]" />
                <div className="relative rounded-[26px] border border-white/18 bg-slate-950/80 bg-clip-padding backdrop-blur-2xl p-4 md:p-6 flex flex-col gap-3.5 shadow-[0_20px_55px_rgba(15,23,42,0.95)]">
                  <div className="flex items-center justify-between gap-2">
                    <div className="space-y-1">
                      <h3 className="text-sm md:text-base font-semibold text-slate-50">
                        Sentiment analysis
                      </h3>
                      <p className="text-[11px] md:text-xs text-slate-300/90">
                        Emotional charge, polarity and over-promising risk.
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span className="text-[10px] md:text-[11px] px-2 py-0.5 rounded-full bg-slate-900/90 border border-white/18 text-slate-100">
                        Analytical
                      </span>
                    </div>
                  </div>

                  <div className="flex items-baseline gap-2 text-sky-300">
                    <span className="text-2xl md:text-3xl font-semibold">
                      {data.watson?.overallScore ?? "–"}
                    </span>
                    <span className="text-xs md:text-sm uppercase tracking-wide">
                      / 100
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-[11px] md:text-xs">
                    <div className="space-y-1.5">
                      <div className="text-slate-300/95">Sentiment</div>
                      <div className="inline-flex px-2.5 py-1 rounded-full bg-slate-900/85 border border-white/18 text-slate-100 text-[11px] md:text-xs">
                        {data.watson?.sentimentLabel ?? "n/a"}
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <div className="text-slate-300/95">Flags</div>
                      <ul className="space-y-1 list-disc list-inside text-slate-100/90">
                        {(data.watson?.topFlags ||
                          ["No major sentiment issues detected."]).map(
                          (flag: string, idx: number) => (
                            <li key={idx}>{flag}</li>
                          )
                        )}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* Cultural card */}
              <div className="relative">
                <div className="absolute inset-[1px] rounded-[26px] bg-gradient-to-br from-fuchsia-500/35 via-violet-500/35 to-cyan-400/35 opacity-80 blur-[3px]" />
                <div className="relative rounded-[26px] border border-white/18 bg-slate-950/80 bg-clip-padding backdrop-blur-2xl p-4 md:p-6 flex flex-col gap-3.5 shadow-[0_20px_55px_rgba(15,23,42,0.95)]">
                  <div className="flex items-center justify-between gap-2">
                    <div className="space-y-1">
                      <h3 className="text-sm md:text-base font-semibold text-slate-50">
                        Cultural analysis
                      </h3>
                      <p className="text-[11px] md:text-xs text-slate-300/90">
                        Taboos, cultural fit, tone-of-voice and context.
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span className="text-[10px] md:text-[11px] px-2 py-0.5 rounded-full bg-slate-900/90 border border-white/18 text-slate-100">
                        Cultural
                      </span>
                    </div>
                  </div>

                  <div className="flex items-baseline gap-2 text-emerald-300">
                    <span className="text-2xl md:text-3xl font-semibold">
                      {data.gemini?.overallScore ?? "–"}
                    </span>
                    <span className="text-xs md:text-sm uppercase tracking-wide">
                      / 100
                    </span>
                  </div>

                  <div className="space-y-2.5 text-[11px] md:text-xs text-slate-100/90">
                    <div>
                      <div className="text-slate-300/95 mb-0.5">
                        Cultural risk
                      </div>
                      <p>
                        {data.gemini?.culturalRiskSummary ??
                          "Summary not available."}
                      </p>
                    </div>

                    <div>
                      <div className="text-slate-300/95 mb-0.5">Tone of voice</div>
                      <p>
                        {data.gemini?.toneSummary ?? "Summary not available."}
                      </p>
                    </div>

                    <div>
                      <div className="text-slate-300/95 mb-0.5">Top risks</div>
                      <ul className="space-y-1 list-disc list-inside">
                        {(data.gemini?.topRisks ||
                          ["No major cultural risks detected."]).map(
                          (risk: string, idx: number) => (
                            <li key={idx}>{risk}</li>
                          )
                        )}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Footer – powered by */}
        <footer className="pt-4 md:pt-6 border-t border-white/10 mt-6 md:mt-8 flex flex-col md:flex-row items-center justify-between gap-2 text-[10px] md:text-xs text-slate-400/90">
          <span>LocAI · Babil Digital Ecosystem</span>
          <span className="flex items-center gap-1.5">
            <span>Powered by</span>
            <span className="font-medium text-slate-200">
              IBM Watson (sentiment)
            </span>
            <span>·</span>
            <span className="font-medium text-slate-200">
              Google Gemini (cultural)
            </span>
          </span>
        </footer>
      </div>
    </main>
  );
}
