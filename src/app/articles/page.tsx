import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Articles on localization & cultural risk | LocAI",
  description:
    "In-depth articles on localization risk, cultural tone, and market expectations — written to help teams avoid costly mistakes before launch.",
  alternates: {
    canonical: "https://locapp.ai/articles",
  },
  openGraph: {
    title: "LocAI Articles",
    description:
      "Insights on localization risk, cultural tone, and real-world market expectations.",
    url: "https://locapp.ai/articles",
    siteName: "LocAI",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "LocAI Articles",
    description:
      "Practical insights on localization, cultural risk, and market expectations.",
  },
};

const articles = [
  {
    title: "Localization risk in game localization",
    description:
      "Why linguistically correct games still fail — and how cultural misalignment quietly breaks immersion and trust.",
    href: "/articles/game-localization-risk",
  },
  // buraya yenileri eklersin
];

export default function ArticlesHubPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[#050816] via-[#110827] to-[#20003c] text-slate-100">

      {/* STICKY GLASS HEADER */}
      <div className="sticky top-0 z-50">
        <div className="backdrop-blur-xl bg-slate-950/50 border-b border-white/10">
          <div className="mx-auto max-w-6xl px-4 md:px-6 py-3 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <Image
                src="/locai-logo.svg"
                alt="LocAI"
                width={96}
                height={28}
                priority
              />
            </Link>

            <Link
              href="/"
              className="rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs text-slate-200 hover:bg-white/10 transition"
            >
              Back to tool
            </Link>
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <div className="relative mx-auto max-w-5xl px-4 md:px-6 pt-16 pb-14 space-y-12">

        {/* HERO */}
        <header className="max-w-3xl space-y-4">
          <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">
            Articles & insights
          </h1>
          <p className="text-base md:text-lg text-slate-200/85">
            Practical perspectives on localization risk, cultural tone,
            and why “correct” translations still fail in real markets.
          </p>
        </header>

        {/* ARTICLES LIST */}
        <section className="grid gap-6 md:grid-cols-2">
          {articles.map((article) => (
            <Link
              key={article.href}
              href={article.href}
              className="group relative block rounded-3xl transition-all duration-300 hover:-translate-y-[2px]"
            >
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-violet-500/25 via-fuchsia-500/20 to-cyan-400/20 blur-[4px] opacity-60 group-hover:opacity-90 transition-opacity" />
              <div className="relative rounded-3xl border border-white/15 bg-slate-950/70 backdrop-blur-2xl p-6 md:p-7 space-y-3 shadow-[0_20px_60px_rgba(15,23,42,0.9)]">
                <h2 className="text-lg font-semibold text-slate-50">
                  {article.title}
                </h2>
                <p className="text-sm text-slate-200/85">
                  {article.description}
                </p>
                <span className="text-xs text-slate-300">
                  Read article →
                </span>
              </div>
            </Link>
          ))}
        </section>

       {/* INTERNAL LINKS */}
<section className="max-w-3xl space-y-4">
  <h2 className="text-lg md:text-xl font-semibold">
    Explore related concepts
  </h2>

  <p className="text-sm md:text-base text-slate-200/85">
    If you are new to localization risk or cultural tone, start with the
    core concepts below before diving into individual articles.
  </p>

  <div className="flex flex-wrap gap-3 pt-2">
    <Link
      href="/localization-risk"
      className="rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs text-slate-200 hover:bg-white/10 transition"
    >
      What is localization risk →
    </Link>

    <Link
      href="/glossary/cultural-tone"
      className="rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs text-slate-200 hover:bg-white/10 transition"
    >
      Cultural tone →
    </Link>

    <Link
      href="/glossary/market-expectations"
      className="rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs text-slate-200 hover:bg-white/10 transition"
    >
      Market expectations →
    </Link>
         </div>
         </section>
        <Footer />
      </div>
    </main>
  );
}
