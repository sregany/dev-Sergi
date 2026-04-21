"use client";

import React from "react";
import { motion } from "framer-motion";

const stacks = [
  {
    title: "AI & Intelligence",
    tags: ["Vercel AI SDK", "OpenAI GPT-4o", "RAG Architecture"],
    progress: 90,
    icon: (
      <svg className="w-6 h-6 text-brand-cyan" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8z"/>
        <circle cx="12" cy="12" r="3"/>
      </svg>
    ),
  },
  {
    title: "Frontend Core",
    tags: ["Next.js 15 (RSC)", "React 19", "TypeScript", "Tailwind"],
    progress: 95,
    icon: (
      <svg className="w-6 h-6 text-brand-purple" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 2 7 12 12 22 7 12 2"/>
        <polyline points="2 17 12 22 22 17"/>
        <polyline points="2 12 12 17 22 12"/>
      </svg>
    ),
  },
  {
    title: "Backend & Data",
    tags: ["Drizzle ORM", "PostgreSQL (Neon)", "Server Actions", "Clerk"],
    progress: 88,
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
    title: "Deployment",
    tags: ["Vercel Edge", "GitOps", "Edge Runtime", "CI/CD"],
    progress: 85,
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
    <section id="stack" className="py-32 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
          <h4 className="text-brand-cyan font-display mb-4 uppercase tracking-[0.3em] md:tracking-[0.3em] text-[10px] md:text-xs font-bold text-center md:text-left">The Neural Stack</h4>
          <h2 className="text-3xl md:text-4xl font-display uppercase tracking-tight text-center md:text-left">Core_Technologies</h2>
          </div>
          <p className="text-white/40 max-w-sm text-sm">
            Leveraging the most advanced tools to build sovereign intelligence systems and high-performance applications.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stacks.map((stack, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="glass p-8 rounded-2xl border-white/5 hover:border-brand-cyan/30 transition-all group"
            >
              <div className="mb-6 p-3 bg-white/5 w-fit rounded-xl group-hover:scale-110 transition-transform">
                {stack.icon}
              </div>
              
              <h3 className="text-xl font-display mb-4 uppercase tracking-wider">{stack.title}</h3>
              
              <div className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  {stack.tags.map((tag, i) => (
                    <span key={i} className="text-[10px] bg-white/5 px-2 py-1 rounded text-white/50 border border-white/5">
                      {tag}
                    </span>
                  ))}
                </div>
                
                <div className="pt-4">
                  <div className="flex justify-between text-[10px] uppercase tracking-widest text-white/30 mb-2">
                    <span>Mastery</span>
                    <span>{stack.progress}%</span>
                  </div>
                  <div className="h-[2px] w-full bg-white/5 overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      whileInView={{ width: `${stack.progress}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, delay: 0.5 }}
                      className="h-full bg-gradient-to-r from-brand-cyan to-brand-purple"
                    />
                  </div>
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
