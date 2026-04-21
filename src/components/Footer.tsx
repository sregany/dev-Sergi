"use client";

import React from "react";
import { motion } from "framer-motion";

const Footer = () => {
  return (
    <footer id="contact" className="pt-32 pb-12 px-6">
      <div className="max-w-7xl mx-auto">
        {/* CTA Section */}
        <div className="relative glass p-12 md:p-24 rounded-[3rem] border-white/5 overflow-hidden text-center mb-24">
          {/* Background Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-brand-cyan/20 blur-[100px] pointer-events-none" />
          
          <div className="relative z-10 max-w-2xl mx-auto">
            <h4 className="text-brand-cyan font-display mb-6 uppercase tracking-[0.4em] text-xs font-bold">Get in touch</h4>
            <h2 className="text-4xl md:text-6xl font-display mb-12 leading-tight">
              Let's build <br />
              <span className="text-glow">intelligent systems</span> <br />
              together.
            </h2>
            
            <div className="flex flex-wrap justify-center gap-6">
              <a href="mailto:sergiregany1996@gmail.com" className="bg-brand-cyan text-bg-dark px-8 py-3 rounded-full font-bold uppercase tracking-widest text-xs hover:scale-105 transition-transform">
                Email Me
              </a>
              <a href="https://www.linkedin.com/in/sregany/" target="_blank" rel="noopener noreferrer" className="bg-white/5 border border-white/10 text-white px-8 py-3 rounded-full font-bold uppercase tracking-widest text-xs hover:bg-white/10 transition-colors">
                LinkedIn
              </a>
              <a href="https://github.com/sregany" target="_blank" rel="noopener noreferrer" className="bg-white/5 border border-white/10 text-white px-8 py-3 rounded-full font-bold uppercase tracking-widest text-xs hover:bg-white/10 transition-colors">
                GitHub
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Footer Info */}
        <div className="border-t border-white/5 pt-12 flex flex-col md:flex-row justify-between items-center gap-8 text-[10px] uppercase tracking-widest text-white/30 font-medium">
          <div className="flex items-center gap-4">
            <span>© 2024 SERGI_REGANY</span>
            <span className="hidden md:inline">•</span>
            <span>Design by Sovereign Intel</span>
          </div>
          
          <div className="flex items-center gap-8">
            <a href="#" className="hover:text-brand-cyan transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-brand-cyan transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-brand-cyan transition-colors">Deploy Status: Online</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
