import Link from "next/link";
import Footer from "@/components/Footer";

export default function UseCasesHub() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[#050816] via-[#110827] to-[#20003c] text-slate-100 px-4 md:px-6 py-12">
      
      <div className="mx-auto w-full max-w-6xl space-y-12">

        {/* HERO */}
        <header className="text-center space-y-4">
          <h1 className="text-3xl md:text-5xl font-semibold tracking-tight">
            Localization{" "}
            <span className="bg-gradient-to-r from-fuchsia-400 via-violet-400 to-cyan-400 bg-clip-text text-transparent">
              use cases
            </span>
          </h1>

          <p className="text-sm md:text-lg text-slate-200/85 max-w-3xl mx-auto">
            Where localization risk actually shows up — across products,
            markets, and growth stages.
          </p>
        </header>

        {/* USE CASE CARDS */}
        <section className="grid gap-6 md:grid-cols-2">
          {[
            {
              title: "SaaS",
              desc:
                "Product copy, onboarding flows, and pricing pages that sound confident in one market but aggressive or unclear in another.",
              href: "/use-cases/saas",
            },
            {
              title: "E-commerce",
              desc:
                "Promotions, urgency cues, and trust signals that convert in one culture but reduce credibility elsewhere.",
              href: "/use-cases/ecommerce",
            },
            {
              title: "Mobile apps",
              desc:
                "In-app messages, notifications, and store descriptions where tone and expectation mismatches hurt retention.",
              href: "/use-cases/mobile-apps",
            },
            {
              title: "Marketing & landing pages",
              desc:
                "Campaign headlines and CTAs that are linguistically correct but culturally misaligned for local audiences.",
              href: "/use-cases/marketing",
            },
          ].map((c) => (
            <Link
              key={c.title}
              href={c.href}
              className="group relative block rounded-3xl transition-all duration-300 hover:-translate-y-[2px]"
            >
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-violet-500/30 via-fuchsia-500/25 to-cyan-400/25 blur-[3px] opacity-60 group-hover:opacity-90 transition-opacity" />

              <div className="relative rounded-3xl border border-white/15 bg-slate-950/70 backdrop-blur-2xl p-6 md:p-7 space-y-3 shadow-[0_20px_60px_rgba(15,23,42,0.9)]">
                <h2 className="text-lg font-semibold text-slate-50">
                  {c.title}
                </h2>
                <p className="text-sm text-slate-200/85 leading-relaxed">
                  {c.desc}
                </p>
                <span className="inline-block text-xs font-medium text-slate-300 group-hover:text-slate-100 transition-colors">
                  View use case →
                </span>
              </div>
            </Link>
          ))}
        </section>

        {/* WHY SECTION */}
        <section className="max-w-4xl mx-auto text-center space-y-4 pt-6">
          <h2 className="text-xl md:text-2xl font-semibold">
            Why use cases matter in localization
          </h2>
          <p className="text-sm md:text-base text-slate-200/85">
            Localization risk rarely appears as a translation error. It shows
            up when expectations, tone, and trust signals differ across markets
            — even when the words are technically correct.
          </p>
        </section>

        {/* INTERNAL LINKS */}
        <section className="flex flex-wrap justify-center gap-4 text-xs md:text-sm text-slate-300/90 pb-4">
          <Link href="/glossary" className="hover:underline">
            Localization glossary
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
