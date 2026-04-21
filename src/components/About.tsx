"use client";

import React from "react";
import { motion } from "framer-motion";

const About = () => {
  return (
    <section id="about" className="py-32 px-6 relative overflow-hidden">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
        {/* Terminal Side */}
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="relative group"
        >
          <div className="absolute -inset-1 bg-gradient-to-r from-brand-cyan to-brand-purple blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
          <div className="relative bg-[#050505] border border-white/10 rounded-xl overflow-hidden shadow-2xl">
            <div className="flex items-center gap-1.5 p-3 border-b border-white/5 bg-white/5">
              <div className="w-3 h-3 rounded-full bg-[#FF5F56]"></div>
              <div className="w-3 h-3 rounded-full bg-[#FFBD2E]"></div>
              <div className="w-3 h-3 rounded-full bg-[#27C93F]"></div>
              <span className="ml-2 text-[10px] text-white/30 font-mono uppercase tracking-widest">sergi-regany — business_logic</span>
            </div>
            <div className="p-6 font-mono text-[10px] sm:text-xs md:text-sm leading-relaxed overflow-x-auto">
              <div className="flex gap-4">
                <span className="text-white/20">01</span>
                <span className="text-brand-purple">class</span>
                <span className="text-white">IntelligentAppDev { "{" }</span>
              </div>
              <div className="flex gap-4">
                <span className="text-white/20">02</span>
                <span className="text-white/40 ml-4">focus: </span>
                <span className="text-brand-cyan">["FullStack_Web", "Applied_AI", "Data_Math"]</span>
                <span className="text-white">,</span>
              </div>
              <div className="flex gap-4">
                <span className="text-white/20">03</span>
                <span className="text-white/40 ml-4">hard_stack: </span>
                <span className="text-brand-cyan">["Next.js_15", "Drizzle", "PostgreSQL", "AI_SDK"]</span>
                <span className="text-white">,</span>
              </div>
              <div className="flex gap-4">
                <span className="text-white/20">04</span>
                <span className="text-white/40 ml-4">mission: </span>
                <span className="text-brand-cyan">"Scalable Solutions with Tangible Impact"</span>
              </div>
              <div className="flex gap-4">
                <span className="text-white/20">05</span>
                <span className="text-white ml-4">status: </span>
                <span className="animate-pulse bg-brand-cyan w-1 h-3 inline-block align-middle ml-1"></span>
              </div>
              <div className="flex gap-4">
                <span className="text-white/20">06</span>
                <span className="text-white">{"}"}</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Text Side */}
        <motion.div
           initial={{ opacity: 0, x: 30 }}
           whileInView={{ opacity: 1, x: 0 }}
           viewport={{ once: true }}
           transition={{ delay: 0.2 }}
        >
          <div className="w-12 h-[2px] bg-brand-cyan mb-8" />
          <h2 className="text-4xl md:text-5xl mb-8 leading-tight">
            Building Scalable Products <br />
            <span className="text-brand-cyan text-glow-turq">with Intelligent Features.</span>
          </h2>
          <p className="text-white/60 text-lg leading-relaxed mb-8">
            As a Full-Stack Developer, I create end-to-end digital experiences that leverage AI to 
            improve efficiency and user experience. My background in Computer Engineering and 
            Mathematics allows me to design robust backend systems with clean, maintainable code.
          </p>
          <p className="text-white/40 text-base leading-relaxed mb-8 italic">
            I specialize in developing enterprise-grade solutions from the ground up. 
            Currently, I am evolving my profile into an <strong>AI-Focused Full-Stack Developer</strong>, 
            integrating modern web architectures with applied AI and cloud automation.
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8">
            <div className="border-l border-white/10 pl-6">
              <h4 className="text-brand-cyan font-display mb-1 uppercase tracking-widest text-[10px]">Digital Products</h4>
              <p className="text-xl md:text-2xl font-bold text-white/90">End-to-End</p>
            </div>
            <div className="border-l border-white/10 pl-6">
              <h4 className="text-brand-purple font-display mb-1 uppercase tracking-widest text-[10px]">Approach</h4>
              <p className="text-xl md:text-2xl font-bold text-white/90">Data Driven</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default About;
