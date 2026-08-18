import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Sergi Regany | Premium Full-Stack AI Engineer",
  description: "Senior AI Engineer specializing in multi-agent orchestration, LLMs, and high-performance neural stack architectures. Transforming static systems into autonomous agentic workflows.",
  keywords: ["AI Engineer", "Multi-Agent Systems", "LLM Orchestration", "Next.js 15", "Neural Stack", "Sovereign Intelligence", "Autonomous AI"],
  authors: [{ name: "Sergi Regany" }],
  openGraph: {
    title: "Sergi Regany | Premium Full-Stack AI Engineer",
    description: "Building the future of autonomous intelligence systems.",
    url: "https://sergiregany.dev",
    siteName: "Sergi Regany Portfolio",
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark h-full" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${spaceGrotesk.variable} antialiased h-full noise-bg dot-grid`}
      >
        <div className="mesh-bg" />
        {children}
      </body>
    </html>
  );
}
