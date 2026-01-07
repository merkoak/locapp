import type { Metadata } from "next";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "What is Localization Risk? | Avoid Cultural Mismatches in Global Growth",
  description: "Localization risk occurs when technically correct translations fail culturally. Learn how to protect your brand trust and conversion rates in new markets with LocAI.",
  keywords: ["Localization Risk", "Cultural Nuance", "Translation Failures", "Global Marketing Strategy", "Cross-Cultural Communication"],
};

export default function LocalizationRiskPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[#050816] via-[#110827] to-[#20003c] text-slate-100 px-4 md:px-6 py-12 flex justify-center">
      <div className="w-full max-w-6xl space-y-12">

        {/* HERO */}
        <header className="text-center space-y-4">
          <h1 className="text-3xl md:text-5xl font-semibold tracking-tight">
            Translation is logic.{" "}
            <span className="bg-gradient-to-r from-fuchsia-400 via-violet-400 to-cyan-400 bg-clip-text text-transparent">
              Localization is feeling.
            </span>
          </h1>

          <p className="text-sm md:text-lg text-slate-200/85 max-w-3xl mx-auto">
            Expanding to new markets requires more than just dictionary definitions. 
            <strong>Localization risk</strong> is the hidden gap between "correct grammar" and "cultural resonance"—and it costs brands millions in lost trust.
          </p>
        </header>

        {/* RISK PILLARS (Grid Structure from Glossary) */}
        <section className="grid gap-6 md:grid-cols-3">
          {[
            {
              title: "Eroding Brand Trust",
              desc:
                "Users instinctively distrust brands that feel 'foreign.' A single tone-deaf phrase signals that you don't understand the local culture, increasing churn.",
            },
            {
              title: "Lower Conversion Rates",
              desc:
                "Cognitive friction kills sales. When copy feels robotic or awkward (the 'Uncanny Valley' of text), users bounce before they buy.",
            },
            {
              title: "Reputational Hazards",
              desc:
                "Avoid accidental taboos. A harmless idiom in English can become a political stance or an insult in another language without context-aware auditing.",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="group relative block rounded-3xl transition-all duration-300 hover:-translate-y-[2px]"
            >
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-violet-500/30 via-fuchsia-500/25 to-cyan-400/25 blur-[3px] opacity-60 group-hover:opacity-90 transition-opacity" />

              <div className="relative h-full rounded-3xl border border-white/15 bg-slate-950/70 backdrop-blur-2xl p-6 md:p-7 space-y-3 shadow-[0_20px_60px_rgba(15,23,42,0.9)]">
                <h2 className="text-lg font-semibold text-slate-50 group-hover:text-white transition-colors">
                  {item.title}
                </h2>
                <p className="text-sm text-slate-200/85 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </section>

        {/* SUMMARY / SEO CONTEXT (Text Section Structure from Glossary) */}
        <section className="max-w-4xl mx-auto text-center space-y-4">
          <h2 className="text-xl md:text-2xl font-semibold">
            Why detecting localization risk matters
          </h2>
          <p className="text-sm md:text-base text-slate-200/85">
            Traditional translation tools focus on linguistic accuracy, but they miss the emotional subtext. 
            <strong>LocAI</strong> acts as your cultural radar, scanning content for tone mismatches, formality errors, and sensitivity risks before you launch.
          </p>
        </section>

        {/* FOOTER */}
        <Footer />
      </div>
    </main>
  );
}