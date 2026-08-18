"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

const nexusImages = [
  "/nexus-ai-0.png",
  "/nexus-ai-1.png",
  "/nexus-ai-2.png"
];

// Solo Nexus AI por ahora para máximo impacto
const secondaryProjects: any[] = [];

const Projects = () => {
  const [currentImg, setCurrentImg] = useState(0);

  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImg((prev) => (prev + 1) % nexusImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section id="projects" className="py-20 md:py-32 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="mb-12 md:mb-20 text-center md:text-left">
          <h4 className="text-brand-cyan font-display mb-4 uppercase tracking-[0.3em] md:tracking-[0.4em] text-[10px] md:text-xs font-bold font-mono">Product Gallery // 2025</h4>
          <h2 className="text-3xl sm:text-5xl md:text-7xl font-display uppercase tracking-tighter font-black">Featured_Works</h2>
        </div>

        {/* 01 // INVESTFINCA - Construction ERP Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-start mb-20 md:mb-32">
          {/* Video Player */}
          <div className="relative group w-full">
            <div className="absolute -inset-4 bg-gradient-to-r from-brand-cyan/20 to-brand-purple/20 blur-2xl opacity-50 group-hover:opacity-100 transition duration-1000"></div>
            <div className="relative aspect-video rounded-2xl md:rounded-[2rem] overflow-hidden border border-white/10 shadow-2xl bg-black">
              <video
                src="/investfinca-video.mp4"
                controls
                autoPlay
                muted
                loop
                playsInline
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Description Content */}
          <div className="flex flex-col">
            <div className="flex items-center gap-3 md:gap-4 mb-4 md:mb-6 flex-wrap">
              <span className="px-2.5 md:px-3 py-1 bg-brand-cyan/10 border border-brand-cyan/20 rounded-full text-[9px] md:text-[10px] uppercase tracking-widest font-bold text-brand-cyan whitespace-nowrap">Featured SaaS</span>
              <span className="text-white/30 text-[10px] font-mono">01 // PROJECT_INVESTFINCA</span>
            </div>

            <h3 className="text-3xl md:text-5xl font-display font-black mb-4 md:mb-6 tracking-tight uppercase">INVESTFINCA – Construction ERP</h3>
            
            <p className="text-white/70 text-sm md:text-base leading-relaxed mb-6">
              A production-ready ERP system designed specifically for construction project management. Provides a collaborative Single Source of Truth where all stakeholders (superadmin, project managers, viewers) operate on a centralized database with full visibility and control over the financial and operational status of all projects.
            </p>

            {/* Impact Banner - Responsive & Non-overlapping */}
            <div className="mb-6 p-3.5 sm:p-4 rounded-2xl bg-brand-cyan/10 border border-brand-cyan/20 backdrop-blur-sm flex items-start gap-3">
              <span className="w-2 h-2 rounded-full bg-brand-cyan animate-pulse mt-1.5 shrink-0" />
              <p className="text-[11px] sm:text-xs text-white/90 leading-relaxed font-mono">
                <strong className="text-brand-cyan uppercase">IMPACT:</strong> 40% reduction in administrative time for construction management through custom software in production. Used by 3+ users (superadmin + project managers) in active production.
              </p>
            </div>

            {/* Trebojocs mention */}
            <div className="mb-8 p-3.5 rounded-xl bg-brand-purple/10 border border-brand-purple/20 text-xs text-white/80 leading-relaxed">
              <strong className="text-brand-purple uppercase font-mono">Trebojocs Platform:</strong> Control de ingresos por máquina/ubicación, discrepancias, KPIs en tiempo real, auditoría y export de datos.
            </div>

            {/* Specs Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
              {[
                { label: "FRAMEWORK", value: "Next.js 14" },
                { label: "AI_CORE", value: "RAG-ready Architecture" },
                { label: "DATA", value: "PostgreSQL / Supabase / Drizzle" },
                { label: "AUTH", value: "Supabase Auth / RLS / RBAC" },
                { label: "UI", value: "Tailwind / shadcn/ui / Recharts" },
                { label: "SDK", value: "Vercel AI / PDF (jspdf)" }
              ].map((spec, i) => (
                <div key={i} className="flex flex-col gap-1 border-l border-white/10 pl-3">
                  <span className="text-[8px] md:text-[9px] uppercase tracking-widest text-white/30 font-bold font-mono">{spec.label}</span>
                  <span className="text-[10px] md:text-xs text-white/80 font-medium">{spec.value}</span>
                </div>
              ))}
            </div>

            {/* Key Modules List */}
            <div className="space-y-3">
              <h4 className="text-xs font-mono uppercase tracking-[0.2em] text-brand-cyan font-bold mb-3">Key Modules //</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-white/70">
                {[
                  "Dashboard & Analytics (KPIs, financial metrics, SQL aggregations)",
                  "Projects Management (CRUD, assignments, status tracking)",
                  "Budgets (CSV import BC3/Excel, chapter/part tracking)",
                  "Certifications (PDF generation, retention guarantees)",
                  "Invoices & Delivery Notes (treasury control, approval workflows)",
                  "Work Diary (daily logs, weather, workers, incidents)",
                  "Document Manager (multi-file support: PDF, images, DWG plans)",
                  "Planning (milestones, Gantt-style task tracking)",
                  "Suppliers Directory (advanced profiles, contact management)",
                  "Global Search (real-time omnisearch across all modules)"
                ].map((mod, idx) => (
                  <div key={idx} className="flex items-start gap-2 p-2 rounded bg-white/[0.02] border border-white/5">
                    <span className="text-brand-cyan font-mono shrink-0">→</span>
                    <span>{mod}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 02 // Nexus AI - Main Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-start mb-20 md:mb-32">
          {/* Image Gallery */}
          <div className="relative group w-full">
            <div className="absolute -inset-4 bg-gradient-to-r from-brand-cyan/20 to-brand-purple/20 blur-2xl opacity-50 group-hover:opacity-100 transition duration-1000"></div>
            <div className="relative aspect-video rounded-2xl md:rounded-[2rem] overflow-hidden border border-white/10 shadow-2xl bg-white/5">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentImg}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.5 }}
                  className="relative w-full h-full"
                >
                  <Image 
                    src={nexusImages[currentImg]} 
                    alt={`Nexus AI Preview ${currentImg}`}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 800px"
                    className="object-cover"
                    priority
                  />
                </motion.div>
              </AnimatePresence>

              {/* Thumbnails */}
              <div className="absolute bottom-4 md:bottom-6 left-1/2 -translate-x-1/2 flex gap-2 md:gap-3 p-1.5 md:p-2 bg-black/40 backdrop-blur-md rounded-full border border-white/10">
                {nexusImages.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentImg(i)}
                    className={`w-2 h-2 md:w-2.5 md:h-2.5 rounded-full transition-all ${currentImg === i ? "bg-brand-cyan w-6 md:w-8" : "bg-white/20 hover:bg-white/40"}`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Description Content */}
          <div className="flex flex-col">
            <div className="flex items-center gap-3 md:gap-4 mb-4 md:mb-6 flex-wrap">
              <span className="px-2.5 md:px-3 py-1 bg-brand-cyan/10 border border-brand-cyan/20 rounded-full text-[9px] md:text-[10px] uppercase tracking-widest font-bold text-brand-cyan whitespace-nowrap">Featured SaaS</span>
              <span className="text-white/30 text-[10px] font-mono">02 // PROJECT_NEXUS</span>
            </div>

            <h3 className="text-3xl md:text-5xl font-display font-black mb-4 md:mb-6 tracking-tight uppercase">Nexus_AI</h3>
            <p className="text-white/70 text-sm md:text-base leading-relaxed mb-6">
              A modern Project Management SaaS where AI is the core engine. Implements a context-aware RAG system (Retrieval-Augmented Generation) that reads task & project context in real-time to deliver actionable insights, task summaries, and natural language project orchestration.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
              {[
                { label: "FRAMEWORK", value: "Next.js 15 (RSC / Server Actions)" },
                { label: "AI_CORE", value: "Gemini 1.5 Flash + Vercel AI SDK" },
                { label: "DATA", value: "Neon PostgreSQL + Drizzle ORM" },
                { label: "AUTH", value: "Clerk Enterprise (OAuth / SSR)" },
                { label: "PAYMENTS", value: "Stripe Checkout & Webhooks" },
                { label: "UI / EXTRAS", value: "Tailwind / Recharts / Sonner" }
              ].map((spec, i) => (
                <div key={i} className="flex flex-col gap-1 border-l border-white/10 pl-3">
                  <span className="text-[8px] md:text-[9px] uppercase tracking-widest text-white/30 font-bold font-mono">{spec.label}</span>
                  <span className="text-[10px] md:text-xs text-white/80 font-medium">{spec.value}</span>
                </div>
              ))}
            </div>

            {/* Key Features List */}
            <div className="space-y-2 mb-8">
              <h4 className="text-xs font-mono uppercase tracking-[0.2em] text-brand-cyan font-bold mb-2">Key Highlights //</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-white/70">
                {[
                  "Context-aware RAG Agent: AI reads DB before answering",
                  "Native Streaming UI: Fast chat experience",
                  "Zero REST Boilerplate: Mutations via Server Actions",
                  "100/100 Accessibility & SEO (Lighthouse audit)"
                ].map((feat, idx) => (
                  <div key={idx} className="flex items-start gap-2 p-2 rounded bg-white/[0.02] border border-white/5">
                    <span className="text-brand-cyan font-mono shrink-0">✓</span>
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <motion.a 
                href="https://nexus-ai-mu-henna.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="bg-white text-black px-6 md:px-10 py-3 md:py-4 rounded-full text-[10px] md:text-xs font-black uppercase tracking-[0.2em] hover:bg-brand-cyan transition-colors text-center"
              >
                Launch_Live
              </motion.a>
              <motion.a 
                href="https://github.com/sregany/NexusAI"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="bg-white/5 border border-white/10 text-white px-6 md:px-10 py-3 md:py-4 rounded-full text-[10px] md:text-xs font-black uppercase tracking-[0.2em] hover:bg-white/10 transition-colors text-center"
              >
                View_GitHub
              </motion.a>
            </div>
          </div>
        </div>

        {/* 03 // TREBOJOCS - Machine & Financial ERP Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-start mb-16">
          {/* Info Card Visual */}
          <div className="relative group w-full">
            <div className="absolute -inset-4 bg-gradient-to-r from-brand-purple/20 to-brand-cyan/20 blur-2xl opacity-50 group-hover:opacity-100 transition duration-1000"></div>
            <div className="relative rounded-2xl md:rounded-[2rem] border border-white/10 shadow-2xl bg-black/80 p-6 md:p-8 space-y-6">
              <div className="flex justify-between items-center border-b border-white/10 pb-4">
                <span className="text-xs font-mono text-brand-purple uppercase tracking-widest font-bold">TREBOJOCS // PLATFORM</span>
                <span className="text-[10px] bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-2.5 py-1 rounded-full uppercase tracking-wider font-bold">Production ERP</span>
              </div>

              <div className="space-y-3 font-mono text-xs text-white/80">
                <div className="flex justify-between p-3 rounded-lg bg-white/5 border border-white/5">
                  <span className="text-white/40">CORE SPACES</span>
                  <span className="text-brand-cyan font-bold">Analytics / Settings / Profile</span>
                </div>
                <div className="flex justify-between p-3 rounded-lg bg-white/5 border border-white/5">
                  <span className="text-white/40">ROLES & PERMISSIONS</span>
                  <span className="text-brand-purple font-bold">ADMIN / OPERATOR / VIEWER</span>
                </div>
                <div className="flex justify-between p-3 rounded-lg bg-white/5 border border-white/5">
                  <span className="text-white/40">SECURITY</span>
                  <span className="text-emerald-400 font-bold">bcryptjs + Middleware Auth</span>
                </div>
                <div className="flex justify-between p-3 rounded-lg bg-white/5 border border-white/5">
                  <span className="text-white/40">DATA EXPORT</span>
                  <span className="text-white font-bold">Admin JSON DB Snapshot</span>
                </div>
              </div>
            </div>
          </div>

          {/* Description Content */}
          <div className="flex flex-col">
            <div className="flex items-center gap-3 md:gap-4 mb-4 md:mb-6 flex-wrap">
              <span className="px-2.5 md:px-3 py-1 bg-brand-purple/10 border border-brand-purple/20 rounded-full text-[9px] md:text-[10px] uppercase tracking-widest font-bold text-brand-purple whitespace-nowrap">Enterprise ERP</span>
              <span className="text-white/30 text-[10px] font-mono">03 // PROJECT_TREBOJOCS</span>
            </div>

            <h3 className="text-3xl md:text-5xl font-display font-black mb-4 md:mb-6 tracking-tight uppercase">TREBOJOCS – Machine & Financial ERP</h3>
            
            <p className="text-white/70 text-sm md:text-base leading-relaxed mb-6">
              Production-ready ERP system designed to manage gaming & vending machines, collections, treasury, and business intelligence analytics. Features automated discrepancy tracking, user audit logs, and admin database snapshot exports.
            </p>

            {/* Specs Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
              {[
                { label: "FRAMEWORK", value: "Next.js 14 (App Router / SSR)" },
                { label: "DATA", value: "PostgreSQL + Prisma ORM" },
                { label: "AUTH", value: "NextAuth.js (Session / bcryptjs)" },
                { label: "UI", value: "Tailwind CSS (Dark / Glassmorphism)" },
                { label: "ANALYTICS", value: "Recharts Responsive Visuals" },
                { label: "DEPLOYMENT", value: "Vercel / Node Server" }
              ].map((spec, i) => (
                <div key={i} className="flex flex-col gap-1 border-l border-white/10 pl-3">
                  <span className="text-[8px] md:text-[9px] uppercase tracking-widest text-white/30 font-bold font-mono">{spec.label}</span>
                  <span className="text-[10px] md:text-xs text-white/80 font-medium">{spec.value}</span>
                </div>
              ))}
            </div>

            {/* Key Features */}
            <div className="space-y-3">
              <h4 className="text-xs font-mono uppercase tracking-[0.2em] text-brand-purple font-bold mb-3">Key Features //</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-white/70">
                {[
                  "Real-time KPI dashboards & location revenue tracking",
                  "Discrepancy tracking: types, counts & visual breakdown",
                  "Audit log: tracking last 10 actions per user",
                  "Admin DB Export: snapshot download in JSON format",
                  "Role Middleware: ADMIN, OPERATOR, VIEWER routing",
                  "i18n ready architecture for multi-language support"
                ].map((feat, idx) => (
                  <div key={idx} className="flex items-start gap-2 p-2 rounded bg-white/[0.02] border border-white/5">
                    <span className="text-brand-purple font-mono shrink-0">→</span>
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Projects;
