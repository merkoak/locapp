// src/app/page.tsx
"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import Link from "next/link";

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
        <div className="flex justify-center">
  <div className="relative">
    <img
      src="/locai-logo.svg"
      alt=""
      aria-hidden="true"
      className="absolute inset-0 h-20 md:h-24 w-auto object-contain block opacity-35 blur-[14px]"
      style={{ mixBlendMode: "screen" }}
      draggable={false}
    />
    <img
      src="/locai-logo.svg"
      alt="LocAI"
      className="relative h-20 md:h-24 w-auto object-contain block"
      draggable={false}
    />
  </div>
</div>





<h1 className="text-3xl md:text-5xl font-semibold tracking-tight text-slate-100">
  Audit your copy{" "}
  <span className="text-slate-100">before </span>
  <span className="bg-gradient-to-r from-fuchsia-400 via-violet-400 to-cyan-400 bg-clip-text text-transparent drop-shadow-[0_0_5px_rgba(255,255,255,0.25)]">
    culture
  </span>
  <span className="text-slate-100"> does.</span>
</h1>

          <p className="text-sm md:text-lg text-slate-200/85 max-w-3xl mx-auto">
            Paste your marketing or product copy. LocAI runs sentiment and
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
                placeholder="Paste your copy here..."
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
            <div className="relative rounded-[26px] border border-white/18 bg-slate-950/70 bg-clip-padding shadow-[0_20px_60px_rgba(15,23,42,0.95)] px-4 py-5 md:px-6 md:py-6 flex flex-col gap-4">
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
                LocAI is your radar; Babil Agency is the human solution.
              </p>
            </div>
          </aside>
        </section>
{/* Learn / SEO content (inserted between the input section and results) */}
<section className="space-y-6">
  {/* Quick links (same palette, minimal) */}
  <div className="flex flex-wrap justify-center gap-3 text-xs md:text-sm text-slate-200/85">
    <Link
      href="/use-cases"
      className="underline decoration-white/30 hover:decoration-white/60"
    >
      Use cases
    </Link>
    <span className="opacity-40">·</span>
    <Link
      href="/glossary/"
      className="underline decoration-white/30 hover:decoration-white/60"
    >
      Glossary
    </Link>
    <span className="opacity-40">·</span>
    <Link
      href="/localization-risk"
      className="underline decoration-white/30 hover:decoration-white/60"
    >
      Localization risk
    </Link>
    <span className="opacity-40">·</span>
    <Link
      href="/cultural-tone-analysis"
      className="underline decoration-white/30 hover:decoration-white/60"
    >
      Cultural tone
    </Link>
    <span className="opacity-40">·</span>
    <Link
      href="/privacy"
      className="underline decoration-white/30 hover:decoration-white/60"
    >
      Privacy
    </Link>
  </div>

  {/* Cards (unified palette, clickable + stronger hover) */}
<div className="grid gap-5 md:grid-cols-3">
  {[
    {
      title: "Use cases",
      desc: "Real situations where copy is technically correct but culturally risky. LoCAl highlights tone, expectation, and trust issues before content goes live.",
      href: "/use-cases",
    },
    {
      title: "Glossary",
      desc: "Clear definitions for localization, translation, and localization risk — explaining how cultural tone and market expectations affect meaning and trust.",
      href: "/glossary",
    },
    {
      title: "Why this matters",
      desc: "Even accurate translations can fail when tone and expectations don’t match the local market, leading to mistrust and lower conversion.",
      href: "/localization-risk",
    },
  ].map((c) => {
    const isUseCases = c.title === "Use cases";

    const glowClass = isUseCases
      ? "bg-gradient-to-br from-cyan-400/45 via-sky-500/30 to-indigo-400/25"
      : "bg-gradient-to-br from-fuchsia-500/35 via-violet-500/30 to-cyan-400/30";

    const innerTint = isUseCases
      ? "bg-gradient-to-br from-cyan-400/12 via-transparent to-sky-400/10"
      : "bg-gradient-to-br from-violet-500/10 via-transparent to-cyan-400/10";

    return (
      <Link
        key={c.title}
        href={c.href}
        aria-label={`Open ${c.title}`}
        className="relative rounded-3xl group block transition-all duration-300 hover:-translate-y-[2px] hover:scale-[1.01]"
      >
        {/* outer glow */}
        <div
          className={`absolute inset-[1px] rounded-[26px] ${glowClass} opacity-60 blur-[3px] group-hover:opacity-90 group-hover:blur-[4px] transition-all duration-300`}
        />

        {/* card surface */}
        <div className="relative rounded-[26px] border border-white/18 bg-slate-950/70 bg-clip-padding backdrop-blur-2xl shadow-[0_20px_60px_rgba(15,23,42,0.95)] p-5 md:p-6 overflow-hidden">
          {/* inner tint */}
          <div
            className={`pointer-events-none absolute inset-0 rounded-[26px] ${innerTint} opacity-70`}
          />

          {/* subtle hover light */}
          <div className="pointer-events-none absolute inset-0 rounded-[26px] bg-white/0 group-hover:bg-white/5 transition-colors duration-300" />

          <div className="relative z-10 flex items-center justify-between gap-3">
            <h2 className="text-sm md:text-base font-semibold tracking-tight text-slate-50 group-hover:text-white transition-colors">
              {c.title}
            </h2>
            <span className="text-[11px] md:text-xs font-medium text-slate-200/80 group-hover:text-slate-100 transition-colors">
              Open
            </span>
          </div>

          <p className="relative z-10 mt-2 text-xs md:text-sm text-slate-200/85 group-hover:text-slate-100 transition-colors leading-relaxed">
            {c.desc}
          </p>
        </div>
      </Link>
    );
  })}
</div>


  {/* Example output (sample) */}
<div className="relative rounded-3xl overflow-hidden">
  {/* Fake border */}
  <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-fuchsia-400/30 via-violet-400/30 to-sky-400/30" />

  {/* Card body */}
  <div className="relative m-[1px] rounded-[22px] bg-slate-950/70 backdrop-blur-2xl shadow-[0_20px_60px_rgba(15,23,42,0.9)] p-5 md:p-7 space-y-3">
    <h2 className="text-sm md:text-base font-semibold tracking-tight text-slate-50">
    Example output
    </h2>

    <div className="text-xs md:text-sm text-slate-200/85 leading-relaxed space-y-1">
      <p>
        <span className="font-semibold text-slate-100">Overall risk:</span>{" "}
        Medium (58/100) 
        The message is clear, but the tone may feel overconfident for the selected market.
      </p>
      <p>
        <span className="font-semibold text-slate-100">Top risks:</span>{" "}
        An overconfident promise, urgency cues that may reduce trust, and a formality level that does not match audience expectations.
      </p>
      <p>
        <span className="font-semibold text-slate-100">Safer rewrite idea:</span>{" "}
        “Get started in minutes” → “Get started quickly, with clear steps and local expectations in mind.”
      </p>
      <p className="opacity-80">
      Expert note: This is an automated first-pass audit. For high-stakes markets, human localization review is still recommended.
      </p>
    </div>
  </div>
</div>


  {/* FAQ (unchanged) */}
  <div className="relative rounded-3xl group">
    <div className="absolute inset-[1px] rounded-[26px] bg-gradient-to-br from-fuchsia-500/22 via-violet-500/18 to-cyan-400/18 opacity-70 blur-[3px] group-hover:opacity-90 transition-opacity" />
    <div className="relative rounded-[26px] border border-white/18 bg-slate-950/70 bg-clip-padding backdrop-blur-2xl shadow-[0_20px_60px_rgba(15,23,42,0.95)] p-5 md:p-7">
      <div className="pointer-events-none absolute inset-0 rounded-[26px] bg-gradient-to-br from-violet-500/10 via-transparent to-cyan-400/10 opacity-60" />

      <h2 className="relative text-sm md:text-base font-semibold tracking-tight text-slate-50 mb-3">
        FAQ
      </h2>

      <div className="relative space-y-3 text-xs md:text-sm">
        {[
          {
            q: "Is LocAI a translation or localization tool?",
            a: "No. LocAI is a localization risk analysis tool. It does not translate text — it audits cultural tone, expectations, and potential trust issues in existing copy.",
          },
          {
            q: "What is localization risk in marketing content?",
            a: "Localization risk occurs when content is linguistically correct but culturally misaligned, causing confusion, mistrust, or lower conversion in local markets.",
          },
          {
            q: "Who should use a localization audit tool like LocAI?",
            a: "Product teams, marketers, SaaS founders, and localization managers who publish customer-facing content across different markets.",
          },
          {
            q: "Can AI detect cultural and tone issues accurately?",
            a: "AI can flag common tone, sentiment, and expectation mismatches at scale. For high-risk launches, LocAI works best as a first-pass before human localization review.",
          },  {
            q: "Is LocAI free to use?",
            a: "Yes. The core localization risk audit is free. Advanced insights and human localization support are available through Babil Agency.",
          },
        ].map((f) => (
          <details
            key={f.q}
            className="rounded-2xl border border-white/10 bg-slate-900/35 overflow-hidden"
          >
            <summary className="cursor-pointer list-none px-4 py-4 flex items-center justify-between gap-4 text-slate-100">
              <span className="font-medium">{f.q}</span>
              <span className="text-slate-400">▾</span>
            </summary>
            <div className="px-4 pb-4">
              <p className="text-slate-200/85 leading-relaxed">{f.a}</p>
            </div>
          </details>
        ))}
      </div>
    </div>
  </div>
</section>

        {/* Results */}
        {data && (
          <section className="space-y-6 md:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Overall banner */}
            <div
              className={`relative rounded-3xl border px-5 py-5 md:px-8 md:py-6 flex flex-col md:flex-row md:items-center justify-between gap-5 md:gap-8 bg-clip-padding backdrop-blur-2xl shadow-[0_20px_60px_rgba(15,23,42,0.95)] ${
                hasCriticalRisk
                  ? "border-rose-500/70 bg-gradient-to-r from-rose-900/85 via-rose-950/95 to-slate-950/95"
                  : data.riskLevel === "medium"
                  ? "border-amber-400/70 bg-gradient-to-r from-amber-900/85 via-slate-950/95 to-slate-950/95"
                  : "border-emerald-400/70 bg-gradient-to-r from-emerald-900/85 via-slate-950/95 to-slate-950/95"
              }`}
            >
              <div className="flex flex-col gap-2 md:gap-3">
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-slate-300/85">
                  Overall cultural safety score
                </span>
                <div className="flex items-baseline gap-3 md:gap-4">
                  <span className="text-4xl md:text-5xl font-bold text-slate-50">
                    {data.overallScore}
                  </span>
                  <span className="text-sm md:text-base uppercase tracking-wide text-slate-200/90">
                    / 100
                  </span>
                  <span className="text-xs md:text-sm px-3 py-1 rounded-full border border-white/45 bg-black/40 text-slate-50 font-medium">
                    {data.riskLevel === "low"
                      ? "Low risk"
                      : data.riskLevel === "medium"
                      ? "Attention needed"
                      : "Critical risk"}
                  </span>
                </div>
                
                <div className="text-sm md:text-base max-w-2xl text-slate-100/95 leading-relaxed">
                  {hasCriticalRisk ? (
                    <p>
                      LocAI detects <strong>critical cultural or tonal risks</strong>. We strongly
                      recommend urgent human review. Babil Agency can redesign this
                      message before it reaches your audience.
                    </p>
                  ) : data.riskLevel === "medium" ? (
                    <p>
                      Your copy is usable but carries <strong>noticeable risks</strong>. A focused
                      localization pass can unlock safer, higher-conversion
                      messaging for your key markets.
                    </p>
                  ) : (
                    <p>
                      Your copy looks relatively safe. You can still localize it for
                      stronger resonance, higher trust, and better performance.
                    </p>
                  )}
                </div>
              </div>

              <div className="flex flex-col items-end gap-2 text-right">
                {hasCriticalRisk && (
                  <a
                    href="https://babiltr.com"
                    className="inline-flex items-center justify-center rounded-2xl px-5 md:px-6 py-2.5 text-sm md:text-base font-bold bg-gradient-to-r from-rose-500 via-amber-400 to-rose-400 hover:from-rose-400 hover:via-amber-300 hover:to-rose-300 shadow-[0_14px_40px_rgba(248,113,113,0.85)] transition-transform active:scale-95"
                  >
                    Urgent: Talk to Babil Agency
                  </a>
                )}
                {!hasCriticalRisk && (
                  <a
                    href="https://babiltr.com"
                    className="inline-flex items-center justify-center rounded-2xl px-5 md:px-6 py-2.5 text-sm md:text-base font-bold bg-gradient-to-r from-fuchsia-500 via-violet-500 to-cyan-400 hover:from-fuchsia-400 hover:via-violet-400 hover:to-cyan-300 shadow-[0_14px_40px_rgba(59,130,246,0.75)] transition-transform active:scale-95"
                  >
                    Improve with Babil Agency
                  </a>
                )}
                <span className="text-xs text-slate-300/85">
                  LocAI is a risk radar. Babil Agency is the human solution.
                </span>
              </div>
            </div>

            {/* Two result cards - STACKED VERTICALLY */}
            {/* grid-cols-1 yaparak alt alta aldık */}
            <div className="grid gap-6 grid-cols-1">
              
              {/* Sentiment card */}
              <div className="relative group">
                <div className="absolute inset-[1px] rounded-[26px] bg-gradient-to-br from-sky-500/35 via-indigo-500/35 to-fuchsia-500/35 opacity-80 blur-[3px] group-hover:opacity-100 transition-opacity" />
                <div className="relative rounded-[26px] border border-white/18 bg-slate-950/80 bg-clip-padding backdrop-blur-2xl p-5 md:p-7 flex flex-col gap-6 shadow-[0_20px_55px_rgba(15,23,42,0.95)]">
                  
                  {/* Başlık ve Skor - SAĞ ÜSTTE */}
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-3">
                        <h3 className="text-lg font-semibold text-slate-50">
                          Sentiment analysis
                        </h3>
                        <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-900/90 border border-white/18 text-slate-300">
                          Analytical
                        </span>
                      </div>
                      <p className="text-xs text-slate-300/90 max-w-lg">
                        Emotional charge & polarity. Detects if your message sounds too aggressive, negative, or overly enthusiastic.
                      </p>
                    </div>

                    {/* Skor ve Etiket Sağda */}
                    <div className="flex flex-col items-end gap-1">
                      <div className="flex items-baseline gap-2 text-sky-300">
                        <span className="text-4xl font-bold">
                          {data.watson?.overallScore ?? "–"}
                        </span>
                        <span className="text-sm uppercase tracking-wide opacity-80">
                          / 100
                        </span>
                      </div>
                      {/* Sentiment Label'ı buraya taşıdık */}
                      <span className="text-xs font-medium uppercase tracking-widest text-sky-200/80">
                        {data.watson?.sentimentLabel ?? "n/a"}
                      </span>
                    </div>
                  </div>

                  {/* Bar ve Flags */}
                  <div className="space-y-2">
                    {/* Etiketi buradan sildik, yukarıya taşıdık */}
                    <div className="text-xs uppercase tracking-wider text-slate-400">
                        Sentiment Spectrum
                    </div>
                    
                    {/* Sentiment Spectrum Bar - Full Width */}
                    <div className="relative h-3 w-full rounded-full bg-slate-800/50 shadow-inner mt-1">
                       <div className="absolute inset-0 rounded-full bg-gradient-to-r from-rose-500/80 via-slate-400/50 to-emerald-500/80" />
                       <div 
                         className="absolute top-1/2 -mt-2 h-4 w-4 -translate-x-1/2 rounded-full border-[2px] border-white bg-slate-100 shadow-[0_0_12px_rgba(255,255,255,0.8)] transition-all duration-1000 ease-out"
                         style={{ 
                           left: `${Math.min(Math.max(data.watson?.overallScore || 0, 0), 100)}%` 
                         }}
                       />
                    </div>
                    <div className="flex justify-between text-[10px] uppercase tracking-widest text-slate-500/80 font-medium pt-1">
                         <span>Negative</span>
                         <span>Neutral</span>
                         <span>Positive</span>
                    </div>
                  </div>

                  {/* Flags */}
                  <div>
                    <div className="text-xs uppercase tracking-wider text-slate-400 mb-2">Flags</div>
                    <ul className="space-y-2 list-disc list-inside text-slate-100/90 leading-relaxed text-sm">
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

              {/* Cultural card */}
              <div className="relative group">
                <div className="absolute inset-[1px] rounded-[26px] bg-gradient-to-br from-fuchsia-500/35 via-violet-500/35 to-cyan-400/35 opacity-80 blur-[3px] group-hover:opacity-100 transition-opacity" />
                <div className="relative rounded-[26px] border border-white/18 bg-slate-950/80 bg-clip-padding backdrop-blur-2xl p-5 md:p-7 flex flex-col gap-6 shadow-[0_20px_55px_rgba(15,23,42,0.95)]">
                  
                  {/* Başlık ve Skor - SAĞ ÜSTTE */}
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-3">
                        <h3 className="text-lg font-semibold text-slate-50">
                          Cultural analysis
                        </h3>
                        <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-900/90 border border-white/18 text-slate-300">
                          Cultural
                        </span>
                      </div>
                      <p className="text-xs text-slate-300/90 max-w-lg">
                        Taboos, cultural fit, tone-of-voice and context.
                      </p>
                    </div>
                    
                    {/* Skor Sağda */}
                    <div className="flex items-baseline gap-2 text-emerald-300">
                      <span className="text-4xl font-bold">
                        {data.gemini?.overallScore ?? "–"}
                      </span>
                      <span className="text-sm uppercase tracking-wide opacity-80">
                        / 100
                      </span>
                    </div>
                  </div>

                  <div className="space-y-6 text-sm md:text-base text-slate-100/95 leading-relaxed">
                    <div>
                      <div className="text-xs uppercase tracking-wider text-slate-400 mb-1.5">
                        Cultural risk
                      </div>
                      <p className="font-medium text-slate-50">
                        {data.gemini?.culturalRiskSummary ??
                          "Summary not available."}
                      </p>
                    </div>

                    <div>
                      <div className="text-xs uppercase tracking-wider text-slate-400 mb-1.5">Tone of voice</div>
                      <p className="text-slate-200">
                        {data.gemini?.toneSummary ?? "Summary not available."}
                      </p>
                    </div>

                    <div>
                      <div className="text-xs uppercase tracking-wider text-slate-400 mb-1.5">Top risks</div>
                      <ul className="space-y-2 list-disc list-inside text-rose-100/90">
                        {(data.gemini?.topRisks ||
                          ["No major cultural risks detected."]).map(
                          (risk: string, idx: number) => (
                            <li key={idx}>{risk}</li>
                          )
                        )}
                      </ul>
                    </div>
                    
                    <div>
                      <div className="text-xs uppercase tracking-wider text-slate-400 mb-1.5">Improvement Ideas</div>
                      <ul className="space-y-2 list-disc list-inside text-emerald-100/90">
                        {(data.gemini?.improvementIdeas ||
                          ["Review content for general clarity."]).map(
                          (idea: string, idx: number) => (
                            <li key={idx}>{idea}</li>
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
              IBM Watson
            </span>
            <span>·</span>
            <span className="font-medium text-slate-200">
              Google Gemini
            </span>
          </span>
        </footer>
      </div>
    </main>
  );
}