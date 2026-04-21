"use client";

import React, { useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, X, Bot, User, Sparkles, MessageSquare } from "lucide-react";
import { useChat } from "@ai-sdk/react";

const ChatAgent = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const { messages, input, handleInputChange, handleSubmit, isLoading, error } = useChat({
    api: "/api/chat",
    initialMessages: [
      {
        id: "1",
        role: "assistant",
        content: "¡Hola! Soy el asistente de Sergi. Me encantaría contarte más sobre sus proyectos en IA, su formación en matemáticas o cómo puede ayudar a tu equipo. ¿Qué te gustaría saber?",
      },
    ],
  });

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <>
      {/* Floating Button */}
      <motion.button
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-16 h-16 bg-brand-cyan text-black rounded-full shadow-2xl flex items-center justify-center z-[150] cursor-pointer group"
      >
        <MessageSquare className="w-7 h-7 group-hover:rotate-12 transition-transform" />
        <div className="absolute -top-1 -right-1 w-4 h-4 bg-white rounded-full animate-ping opacity-20" />
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.9, x: 50 }}
            animate={{ opacity: 1, y: 0, scale: 1, x: 0 }}
            exit={{ opacity: 0, y: 100, scale: 0.9, x: 50 }}
            className="fixed bottom-24 right-6 w-[90vw] sm:w-[400px] h-[600px] bg-black/90 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-2xl z-[160] flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="p-6 border-b border-white/10 flex justify-between items-center bg-white/5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-brand-cyan/20 flex items-center justify-center border border-brand-cyan/30">
                  <Bot className="text-brand-cyan w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-white font-bold text-sm">Sergi AI Assistant</h3>
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-[10px] text-white/40 uppercase tracking-widest font-bold">Online</span>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-white/10 rounded-full transition-colors text-white/40 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages Area */}
            <div 
              ref={scrollRef}
              className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth"
            >
              {messages.map((m) => (
                <motion.div
                  key={m.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div className={`flex gap-3 max-w-[85%] ${m.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 border ${
                      m.role === "user" 
                        ? "bg-white/10 border-white/20" 
                        : "bg-brand-cyan/10 border-brand-cyan/20"
                    }`}>
                      {m.role === "user" ? <User className="w-4 h-4 text-white/60" /> : <Sparkles className="w-4 h-4 text-brand-cyan" />}
                    </div>
                    <div className={`p-4 rounded-2xl text-xs leading-relaxed ${
                      m.role === "user"
                        ? "bg-brand-cyan text-black font-medium"
                        : "bg-white/5 text-white/80 border border-white/10"
                    }`}>
                      {m.content}
                    </div>
                  </div>
                </motion.div>
              ))}
              {isLoading && (
                <div className="flex justify-start animate-pulse">
                  <div className="flex gap-3 max-w-[80%]">
                    <div className="w-8 h-8 rounded-full bg-brand-cyan/10 border border-brand-cyan/20 flex items-center justify-center">
                      <Bot className="w-4 h-4 text-brand-cyan" />
                    </div>
                    <div className="p-4 rounded-2xl bg-white/5 text-brand-cyan text-[10px] font-bold tracking-widest flex items-center gap-2 uppercase">
                      <div className="flex gap-1">
                        <div className="w-1 h-1 bg-brand-cyan rounded-full animate-bounce" />
                        <div className="w-1 h-1 bg-brand-cyan rounded-full animate-bounce [animation-delay:0.2s]" />
                        <div className="w-1 h-1 bg-brand-cyan rounded-full animate-bounce [animation-delay:0.4s]" />
                      </div>
                      Pensando
                    </div>
                  </div>
                </div>
              )}
              {error && (
                <div className="text-center p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-[10px] uppercase tracking-wider font-bold">
                  Error de conexión. Prueba de nuevo.
                </div>
              )}
            </div>

            {/* Input Area */}
            <form 
              onSubmit={handleSubmit}
              className="p-6 bg-white/5 border-t border-white/10"
            >
              <div className="relative">
                <input
                  type="text"
                  value={input || ""}
                  onChange={handleInputChange}
                  placeholder="Pregunta sobre Sergi..."
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-6 pr-14 text-xs text-white placeholder:text-white/20 focus:outline-none focus:border-brand-cyan/50 transition-all"
                />
                <button
                  type="submit"
                  disabled={isLoading || !(input || "").trim()}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2.5 bg-brand-cyan text-black rounded-xl hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100 transition-all cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
              <p className="mt-3 text-center text-[9px] text-white/20 uppercase tracking-[0.2em] font-bold">
                Powered by Sergi AI Core
              </p>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ChatAgent;
