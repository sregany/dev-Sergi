"use client";

import React from "react";
import { motion } from "framer-motion";

const milestones = [
  {
    period: "2022 – PRESENT",
    role: "IT Engineer & Custom SaaS Developer",
    company: "Trebojocs",
    description: "Design and deployment of tailored SaaS solutions for a multi-sector business group. Combining infrastructure maintenance with full-stack development focused on real business impact.",
    tags: ["Next.js", "Node.js", "PostgreSQL", "SaaS Architecture"],
    active: true,
  },
  {
    period: "2021 – 2022",
    role: "Full-Stack AI Developer",
    company: "Freelance",
    description: "Built React dashboards integrated with LLM APIs and automation pipelines for startup and e-commerce clients. Focused on rapid delivery and intelligent feature integration.",
    tags: ["React", "OpenAI API", "Automation", "REST APIs"],
    active: false,
  },
  {
    period: "2019 – 2021",
    role: "Software & Robotics Engineer",
    company: "Academic Projects & Internships",
    description: "Developed computer vision systems, industrial automation with ROS2, and cloud architectures applied to embedded systems and industrial robotics.",
    tags: ["ROS2", "Computer Vision", "Cloud Infra", "Embedded Systems"],
    active: false,
  },
];

const EvolutionMap = () => {
  return (
    <section id="evolution" className="py-32 px-6 text-white">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <h4 className="text-brand-purple font-display mb-4 uppercase tracking-[0.3em] text-xs font-bold font-mono">Professional Timeline</h4>
          <h2 className="text-4xl md:text-5xl font-display uppercase tracking-tight">Evolution_MAP</h2>
        </motion.div>

        <div className="relative">
          {/* Vertical Line */}
          <div className="absolute left-6 top-0 bottom-0 w-[1px] bg-gradient-to-b from-brand-cyan via-brand-purple to-transparent" />

          <div className="space-y-10 pl-16">
            {milestones.map((ms, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.15 }}
                className="relative group"
              >
                {/* Dot on line */}
                <div className={`absolute -left-[42px] top-6 w-4 h-4 rounded-full border-2 z-10 transition-all group-hover:scale-125 ${
                  ms.active
                    ? "bg-brand-cyan border-brand-cyan shadow-[0_0_10px_rgba(0,242,254,0.5)]"
                    : "bg-bg-dark border-brand-purple"
                }`} />

                {/* Card */}
                <div className={`glass p-8 rounded-2xl border transition-all group-hover:border-brand-purple/40 ${
                  ms.active ? "border-brand-cyan/20" : "border-white/5"
                }`}>
                  {/* Period + Active Badge */}
                  <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                    <span className="font-mono text-xs text-brand-purple uppercase tracking-widest">{ms.period}</span>
                    {ms.active && (
                      <span className="flex items-center gap-1.5 text-[9px] uppercase tracking-widest text-brand-cyan font-mono bg-brand-cyan/10 border border-brand-cyan/20 px-2 py-1 rounded-full">
                        <span className="w-1 h-1 rounded-full bg-brand-cyan animate-pulse block" />
                        Current Role
                      </span>
                    )}
                  </div>

                  <h3 className="text-lg md:text-xl font-display mb-1 uppercase tracking-wide">{ms.role}</h3>
                  <p className="text-brand-cyan text-[10px] font-mono mb-4 uppercase tracking-widest">{ms.company}</p>

                  <p className="text-white/50 text-sm leading-relaxed mb-6">{ms.description}</p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2">
                    {ms.tags.map((tag, i) => (
                      <span key={i} className="text-[9px] bg-white/5 border border-white/10 px-2.5 py-1 rounded-md text-white/40 font-mono uppercase tracking-wider group-hover:border-brand-purple/20 transition-colors">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default EvolutionMap;
