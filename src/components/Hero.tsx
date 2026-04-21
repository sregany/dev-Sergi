"use client";

import React, { useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const Hero = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useTransform(scrollYProgress, [0, 1], [0, 1]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center pt-20 pb-32 px-6 overflow-hidden dot-grid">
      {/* Scroll Progress Bar */}
      <motion.div 
        className="fixed top-0 left-0 right-0 h-[2px] bg-brand-cyan origin-left z-[110]"
        style={{ scaleX }}
      />

      {/* Dynamic Background Lighting (Split) */}
      <div className="absolute top-1/2 left-[20%] -translate-y-1/2 w-[800px] h-[800px] glow-left blur-[120px] pointer-events-none opacity-60" />
      <div className="absolute top-1/2 right-[20%] -translate-y-1/2 w-[800px] h-[800px] glow-right blur-[120px] pointer-events-none opacity-40" />
      
      {/* Orbiting Ellipses (Subtle) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-[900px] max-h-[900px] pointer-events-none">
         <div className="absolute inset-0 border border-white/5 rounded-[100%] rotate-[20deg] animate-[orbit_40s_linear_infinite] opacity-40"></div>
         <div className="absolute inset-0 border border-brand-cyan/10 rounded-[100%] rotate-[140deg] animate-[orbit_50s_linear_infinite_reverse] opacity-20"></div>
         <div className="absolute inset-0 border border-white/5 rounded-[100%] rotate-[80deg] animate-[orbit_60s_linear_infinite] opacity-30"></div>
      </div>

      {/* Navigation (Fixed) */}
      <div className="fixed top-0 left-0 w-full p-4 md:p-8 flex justify-between items-center z-[100] max-w-[1440px] mx-auto right-0 backdrop-blur-md bg-black/40 border-b border-white/5">
        <div className="flex items-center gap-3 group cursor-pointer">
          <div className="w-8 h-8 bg-white/5 border border-white/10 rounded flex items-center justify-center font-bold text-xs group-hover:border-brand-cyan transition-colors group-hover:text-brand-cyan">SR</div>
          <span className="hidden sm:inline text-[9px] uppercase font-bold tracking-[0.2em] text-white/40 group-hover:text-white transition-colors">Digital_Identity_v3</span>
        </div>
        
        <div className="hidden lg:flex items-center gap-10 text-[9px] uppercase tracking-[0.4em] font-bold text-white/30">
          <a href="#projects" className="hover:text-brand-cyan transition-all hover:tracking-[0.6em] cursor-pointer">Projects</a>
          <a href="#about" className="hover:text-brand-cyan transition-all hover:tracking-[0.6em] cursor-pointer">Abilities</a>
          <a href="#stack" className="hover:text-brand-cyan transition-all hover:tracking-[0.6em] cursor-pointer">Stack</a>
          <a href="#contact" className="hover:text-brand-cyan transition-all hover:tracking-[0.6em] cursor-pointer">Contact</a>
        </div>

        <div className="flex gap-4">
          <a href="#contact" className="bg-brand-cyan/10 border border-brand-cyan/20 text-brand-cyan px-4 md:px-6 py-2 rounded-full text-[9px] font-bold uppercase tracking-widest hover:bg-brand-cyan hover:text-bg-dark transition-all">
            Contact
          </a>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center text-center max-w-7xl mx-auto py-20 px-4 md:px-0">
        
        {/* Top Badges */}
        <motion.div
           initial={{ opacity: 0, y: -10 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 1 }}
           className="flex flex-col items-center gap-3 mb-8 md:mb-10"
        >
          <span className="text-[8px] md:text-[10px] uppercase tracking-[0.3em] md:tracking-[0.5em] font-bold text-white/20 font-mono">system.identity.authorized</span>
          <div className="flex items-center gap-2 px-4 py-1.5 bg-white/5 border border-white/10 rounded-full backdrop-blur-sm">
            <div className="w-1.5 h-1.5 rounded-full bg-[#00FF85] animate-pulse shadow-[0_0_8px_#00FF85]" />
            <span className="text-[8px] uppercase tracking-[0.2em] font-bold text-white/50">Available for hire</span>
          </div>
        </motion.div>

        {/* Hero Title (Identical to Image) */}
        <motion.h1 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="text-4xl sm:text-6xl md:text-[85px] font-display font-black leading-[1.1] md:leading-[1.0] tracking-tighter mb-12 md:mb-16"
        >
          <span className="text-white">Sergi —</span><br />
          <span className="text-[#00F2FE] text-glow-turq">
            AI Engineer & Full-
          </span>
          <div className="inline-block w-2 md:w-[14px] h-[30px] sm:h-[55px] md:h-[75px] bg-[#3a3a00]/40 align-middle ml-1 md:ml-3 mb-1" /><br />
          <span className="bg-gradient-to-r from-[#5dade2] to-[#a569bd] bg-clip-text text-transparent opacity-90 text-glow-blue whitespace-nowrap sm:whitespace-normal">
            Stack Developer
          </span>
        </motion.h1>

        {/* Terminal Info Bar (Cyan Text) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="relative w-full max-w-2xl px-4"
        >
          <div className="bg-[#050505] border border-white/5 px-4 md:px-8 py-4 md:py-5 rounded-md flex items-center justify-center">
            <span className="text-[#00F2FE] font-mono text-[9px] sm:text-[11px] md:text-sm tracking-[0.05em] md:tracking-[0.1em] font-medium leading-relaxed">
              {"> "} Building intelligent systems <span className="hidden sm:inline text-white/10 px-3">•</span> 
              <br className="sm:hidden" />
              LLMs <span className="text-white/10 px-2 sm:px-3">•</span> 
              Cloud infra <span className="text-white/10 px-2 sm:px-3">•</span> 
              AI Automation_
            </span>
          </div>
        </motion.div>
      </div>

      {/* Subtle Scroll Hint */}
      <div className="absolute bottom-12 flex flex-col items-center gap-4 opacity-10">
        <div className="w-[1px] h-10 bg-white" />
      </div>
    </section>
  );
};

export default Hero;
