export default function Footer() {
  return (
    <footer className="border-t border-white/10">
      <div className="mx-auto max-w-6xl px-4 md:px-6 py-4 md:py-6 flex flex-col md:flex-row items-center justify-between gap-2 text-[10px] md:text-xs text-slate-400/90">
        
        <span>LocAI · Babil Digital Ecosystem</span>

        <span className="flex items-center gap-1.5">
          <span>Powered by</span>
          <span className="font-medium text-slate-200">IBM Watson</span>
          <span>·</span>
          <span className="font-medium text-slate-200">Google Gemini</span>
        </span>

      </div>
    </footer>
  );
}
