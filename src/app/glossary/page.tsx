import Link from "next/link";
import Footer from "@/components/Footer";

export default function GlossaryHub() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[#050816] via-[#110827] to-[#20003c] text-slate-100 px-4 md:px-6 py-12 flex justify-center">
      <div className="w-full max-w-6xl space-y-12">

        {/* HERO */}
        <header className="text-center space-y-4">
          <h1 className="text-3xl md:text-5xl font-semibold tracking-tight">
            Localization glossary{" "}
            <span className="bg-gradient-to-r from-fuchsia-400 via-violet-400 to-cyan-400 bg-clip-text text-transparent">
              for real-world decisions
            </span>
          </h1>

          <p className="text-sm md:text-lg text-slate-200/85 max-w-3xl mx-auto">
            Clear, practical definitions for localization, translation, cultural tone,
            and market expectations — written for product and marketing teams.
          </p>
        </header>

        {/* GLOSSARY ITEMS */}
        <section className="grid gap-6 md:grid-cols-2">
          {[
            {
              title: "Localization vs Translation",
              desc:
                "Why correct translation can still fail — and how localization accounts for tone, expectations, and cultural context.",
              href: "/glossary/localization-vs-translation",
            },
            {
              title: "Localization risk",
              desc:
                "What happens when content is linguistically correct but culturally misaligned, reducing trust and conversion.",
              href: "/localization-risk",
            },
            {
              title: "Cultural tone",
              desc:
                "How formality, confidence, and emotional signals differ across markets — and why tone matters more than words.",
              href: "/cultural-tone-analysis",
            },
            {
              title: "Market expectations",
              desc:
                "Unspoken assumptions users bring from their local culture, shaping how they interpret copy and messaging.",
              href: "/glossary/market-expectations",
            },
          ].map((g) => (
            <Link
              key={g.title}
              href={g.href}
              className="group relative block rounded-3xl transition-all duration-300 hover:-translate-y-[2px]"
            >
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-violet-500/30 via-fuchsia-500/25 to-cyan-400/25 blur-[3px] opacity-60 group-hover:opacity-90 transition-opacity" />

              <div className="relative rounded-3xl border border-white/15 bg-slate-950/70 backdrop-blur-2xl p-6 md:p-7 space-y-3 shadow-[0_20px_60px_rgba(15,23,42,0.9)]">
                <h2 className="text-lg font-semibold text-slate-50 group-hover:text-white transition-colors">
                  {g.title}
                </h2>
                <p className="text-sm text-slate-200/85 leading-relaxed">
                  {g.desc}
                </p>
                <span className="inline-block text-xs font-medium text-slate-300 group-hover:text-slate-100 transition-colors">
                  Read definition →
                </span>
              </div>
            </Link>
          ))}
        </section>

        {/* WHY GLOSSARY MATTERS */}
        <section className="max-w-4xl mx-auto text-center space-y-4">
          <h2 className="text-xl md:text-2xl font-semibold">
            Why a localization glossary matters
          </h2>
          <p className="text-sm md:text-base text-slate-200/85">
            Teams often talk past each other using the same words with different meanings.
            This glossary aligns terminology so localization decisions are deliberate,
            not accidental.
          </p>
        </section>

        {/* INTERNAL LINKS */}
        <section className="flex flex-wrap justify-center gap-4 text-xs md:text-sm text-slate-300/90">
          <Link href="/use-cases" className="hover:underline">
            Use cases
          </Link>
          <span className="opacity-40">·</span>
          <Link href="/localization-risk" className="hover:underline">
            What is localization risk?
          </Link>
        </section>

        {/* FOOTER */}
        <Footer />
      </div>
    </main>
  );
}
