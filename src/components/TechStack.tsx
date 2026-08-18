"use client";

import React from "react";
import { motion } from "framer-motion";

const stacks = [
  {
    title: "AI & Intelligence Engine",
    tags: ["Vercel AI SDK", "Gemini 1.5 Flash", "RAG Architecture", "Streaming APIs", "OpenAI GPT-4o"],
    progress: 92,
    icon: (
      <svg className="w-6 h-6 text-brand-cyan" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8z"/>
        <circle cx="12" cy="12" r="3"/>
      </svg>
    ),
  },
  {
    title: "Frontend & Web Core",
    tags: ["Next.js 15 / 14", "React 19", "TypeScript (Strict)", "Tailwind CSS", "shadcn/ui"],
    progress: 96,
    icon: (
      <svg className="w-6 h-6 text-brand-purple" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 2 7 12 12 22 7 12 2"/>
        <polyline points="2 17 12 22 22 17"/>
        <polyline points="2 12 12 17 22 12"/>
      </svg>
    ),
  },
  {
    title: "Databases & ORMs",
    tags: ["PostgreSQL (Neon / Supabase)", "Drizzle ORM", "Prisma ORM", "Server Actions", "Supabase Storage"],
    progress: 90,
    icon: (
      <svg className="w-6 h-6 text-brand-blue" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="20" height="8" rx="2" ry="2"/>
        <rect x="2" y="14" width="20" height="8" rx="2" ry="2"/>
        <line x1="6" y1="6" x2="6" y2="6"/>
        <line x1="6" y1="18" x2="6" y2="18"/>
      </svg>
    ),
  },
  {
    title: "Auth, Security & Payments",
    tags: ["Clerk OAuth", "Supabase Auth & RLS", "NextAuth.js", "Stripe Webhooks", "bcryptjs / RBAC"],
    progress: 88,
    icon: (
      <svg className="w-6 h-6 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
        <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
      </svg>
    ),
  },
  {
    title: "UI Components & Analytics",
    tags: ["Recharts (BI)", "Lucide Icons", "Sonner (Toasts)", "jspdf / autotable", "xlsx (BC3 / Excel)"],
    progress: 94,
    icon: (
      <svg className="w-6 h-6 text-amber-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="20" x2="18" y2="10"/>
        <line x1="12" y1="20" x2="12" y2="4"/>
        <line x1="6" y1="20" x2="6" y2="14"/>
      </svg>
    ),
  },
  {
    title: "Deployment & Systems",
    tags: ["Vercel Edge", "Node Server", "Docker", "ROS2 Robotics", "GitOps & CI/CD"],
    progress: 86,
    icon: (
      <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
        <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
        <line x1="12" y1="22.08" x2="12" y2="12"/>
      </svg>
    ),
  }
];

const TechStack = () => {
  return (
    <section id="stack" className="py-20 md:py-32 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <h4 className="text-brand-cyan font-display mb-4 uppercase tracking-[0.3em] md:tracking-[0.3em] text-[10px] md:text-xs font-bold text-center md:text-left">The Neural Stack</h4>
            <h2 className="text-3xl md:text-5xl font-display uppercase tracking-tight text-center md:text-left font-black">Core_Technologies</h2>
          </div>
          <p className="text-white/40 max-w-md text-sm leading-relaxed">
            Production-proven tech stack used across autonomous AI SaaS applications, enterprise construction ERPs, and financial platforms.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stacks.map((stack, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.08 }}
              className="glass p-6 md:p-8 rounded-2xl border-white/5 hover:border-brand-cyan/30 transition-all group flex flex-col justify-between"
            >
              <div>
                <div className="mb-6 p-3 bg-white/5 w-fit rounded-xl group-hover:scale-110 transition-transform">
                  {stack.icon}
                </div>
                
                <h3 className="text-lg md:text-xl font-display mb-4 uppercase tracking-wider font-bold">{stack.title}</h3>
                
                <div className="flex flex-wrap gap-2 mb-6">
                  {stack.tags.map((tag, i) => (
                    <span key={i} className="text-[10px] bg-white/5 px-2.5 py-1 rounded-md text-white/70 border border-white/10 font-mono">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[10px] uppercase tracking-widest text-white/30 mb-2 font-mono">
                  <span>Proficiency</span>
                  <span>{stack.progress}%</span>
                </div>
                <div className="h-[2px] w-full bg-white/5 overflow-hidden rounded-full">
                  <motion.div 
                    initial={{ width: 0 }}
                    whileInView={{ width: `${stack.progress}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: 0.3 }}
                    className="h-full bg-gradient-to-r from-brand-cyan via-brand-purple to-emerald-400"
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TechStack;
