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
    <section id="projects" className="py-32 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="mb-20 text-center md:text-left">
          <h4 className="text-brand-cyan font-display mb-4 uppercase tracking-[0.3em] md:tracking-[0.4em] text-[10px] md:text-xs font-bold font-mono">Product Gallery // 2025</h4>
          <h2 className="text-4xl md:text-7xl font-display uppercase tracking-tighter font-black">Featured_Works</h2>
        </div>

        {/* Nexus AI - Main Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center mb-32">
          {/* Image Gallery */}
          <div className="relative group">
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
            <div className="flex items-center gap-3 md:gap-4 mb-4 md:mb-6">
              <span className="px-2 md:px-3 py-1 bg-brand-cyan/10 border border-brand-cyan/20 rounded-full text-[9px] md:text-[10px] uppercase tracking-widest font-bold text-brand-cyan whitespace-nowrap">Featured SaaS</span>
              <span className="text-white/20 text-[10px] font-mono">01 // PROJECT_NEXUS</span>
            </div>

            <h3 className="text-3xl md:text-6xl font-display font-black mb-6 md:mb-8 tracking-tight uppercase">Nexus_AI</h3>
            <p className="text-white/50 text-sm md:text-lg leading-relaxed mb-8 md:mb-10">
              A high-performance Project Management SaaS that transforms static task tracking into an autonomous experience. 
              By implementing a context-aware RAG system (Retrieval-Augmented Generation), 
              the integrated AI agent reads your database in real-time to provide actionable insights, 
              task summaries, and natural language project orchestration.
            </p>

            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-10 md:mb-12">
              {[
                { label: "FRAMEWORK", value: "Next.js 15" },
                { label: "AI_CORE", value: "RAG / Gemini" },
                { label: "DATA", value: "Drizzle / Neon" },
                { label: "AUTH", value: "Clerk / Stripe" },
                { label: "UI", value: "Tailwind CSS" },
                { label: "SDK", value: "Vercel AI" }
              ].map((spec, i) => (
                <div key={i} className="flex flex-col gap-1 border-l border-white/10 pl-3 md:pl-4">
                  <span className="text-[8px] md:text-[9px] uppercase tracking-widest text-white/20 font-bold">{spec.label}</span>
                  <span className="text-[10px] md:text-xs text-white/60 font-medium">{spec.value}</span>
                </div>
              ))}
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

        {/* Los proyectos secundarios han sido eliminados por petición del usuario */}
      </div>
    </section>
  );
};

export default Projects;
