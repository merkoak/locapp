// src/app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "LocAI – Cultural Risk Auditor",
  description: "LocAI (LocApp.ai) by Babil Agency – cultural and tonal risk radar.",
};

export default function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props;

  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-slate-950 text-slate-100 antialiased">
        {children}
      </body>
    </html>
  );
}
