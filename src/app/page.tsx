"use client";

import { motion } from "framer-motion";
import Hero from "@/components/Hero";
import About from "@/components/About";
import TechStack from "@/components/TechStack";
import Projects from "@/components/Projects";
import EvolutionMap from "@/components/EvolutionMap";
import Footer from "@/components/Footer";
import ChatAgent from "@/components/ChatAgent";

const SectionReveal = ({ children, id }: { children: React.ReactNode, id?: string }) => (
  <motion.div
    id={id}
    initial={{ opacity: 0, y: 50 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-100px" }}
    transition={{ duration: 0.8, ease: [0.21, 1.11, 0.81, 0.99] }}
  >
    {children}
  </motion.div>
);

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col">
      <Hero />
      
      <div className="relative z-10 flex flex-col gap-10">
        <SectionReveal id="about">
          <About />
        </SectionReveal>

        <SectionReveal id="stack">
          <TechStack />
        </SectionReveal>

        <SectionReveal id="projects">
          <Projects />
        </SectionReveal>

        <SectionReveal>
          <EvolutionMap />
        </SectionReveal>

        <SectionReveal id="contact">
          <Footer />
        </SectionReveal>
      </div>

      <ChatAgent />
    </main>
  );
}
