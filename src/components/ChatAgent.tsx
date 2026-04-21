"use client";

import React, { useRef, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, X, Bot, User, Sparkles, MessageSquare } from "lucide-react";
import { useChat } from "@ai-sdk/react";

const ChatAgent = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [localInput, setLocalInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const hasGreeted = useRef(false);

  const { messages, setMessages, append, isLoading } = useChat({
    api: "/api/chat",
  });

  // Saludo automático a los 3 segundos
  useEffect(() => {
    if (hasGreeted.current) return;
    
    const timer = setTimeout(() => {
      hasGreeted.current = true;
      setMessages([{
        id: "auto-greeting",
        role: "assistant",
        content: "¡Hola! Soy el asistente de Sergi. Me encantaría contarte más sobre sus proyectos en IA. ¿Qué te gustaría saber?"
      }]);
    }, 3000);

    return () => clearTimeout(timer);
  }, [setMessages]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const val = localInput.trim();
    if (!val || isLoading) return;

    setLocalInput("");
    await append({ role: "user", content: val });
  };

  return (
    <>
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-16 h-16 bg-brand-cyan text-black rounded-full shadow-2xl flex items-center justify-center z-[150] cursor-pointer group"
      >
        <MessageSquare className="w-7 h-7 group-hover:rotate-12 transition-transform" />
        {messages.length > 1 && !isOpen && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-black" />
        )}
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.9 }}
            className="fixed bottom-24 right-6 w-[90vw] sm:w-[400px] h-[600px] bg-black/90 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-2xl z-[160] flex flex-col overflow-hidden"
          >
            <div className="p-6 border-b border-white/10 flex justify-between items-center bg-white/5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-brand-cyan/20 flex items-center justify-center border border-brand-cyan/30">
                  <Bot className="text-brand-cyan w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-white font-bold text-sm">Sergi AI Assistant</h3>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-[10px] text-white/40 uppercase tracking-widest font-bold">Online</span>
                  </div>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="p-2 text-white/40 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6">
              {messages.map((m) => (
                <div key={m.id} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`flex gap-3 max-w-[85%] ${m.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 border ${m.role === "user" ? "bg-white/10" : "bg-brand-cyan/10 border-brand-cyan/20"}`}>
                      {m.role === "user" ? <User className="w-4 h-4 text-white/60" /> : <Sparkles className="w-4 h-4 text-brand-cyan" />}
                    </div>
                    <div className={`p-4 rounded-2xl text-xs leading-relaxed ${m.role === "user" ? "bg-brand-cyan text-black font-medium" : "bg-white/5 text-white/80 border border-white/10"}`}>
                      {m.content}
                    </div>
                  </div>
                </div>
              ))}
              {isLoading && <div className="text-brand-cyan text-[10px] font-bold uppercase animate-pulse p-4">Escribiendo...</div>}
            </div>

            <form onSubmit={handleFormSubmit} className="p-6 bg-white/5 border-t border-white/10">
              <div className="relative">
                <input
                  type="text"
                  value={localInput}
                  onChange={(e) => setLocalInput(e.target.value)}
                  placeholder="Pregunta sobre Sergi..."
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-6 pr-14 text-xs text-white focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={isLoading || !localInput.trim()}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2.5 bg-brand-cyan text-black rounded-xl cursor-pointer disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ChatAgent;