"use client";

import React, { useRef, useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, X, Bot, Sparkles, MessageSquare } from "lucide-react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

const GREETING: Message = {
  id: "greeting",
  role: "assistant",
  content:
    "¡Hola! Soy el asistente de Sergi. Me encantaría contarte más sobre sus proyectos en IA. ¿Qué te gustaría saber?",
};

export default function ChatAgent() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const hasGreeted = useRef(false);

  useEffect(() => {
    if (hasGreeted.current) return;
    const t = setTimeout(() => {
      hasGreeted.current = true;
      setMessages([GREETING]);
    }, 3000);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = useCallback(
    async (text: string) => {
      const userMsg: Message = {
        id: Date.now().toString(),
        role: "user",
        content: text,
      };

      const nextMessages = [...messages, userMsg];
      setMessages(nextMessages);
      setIsLoading(true);

      const assistantId = (Date.now() + 1).toString();
      setMessages((prev) => [
        ...prev,
        { id: assistantId, role: "assistant", content: "" },
      ]);

      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: nextMessages.map((m) => ({
              role: m.role,
              content: m.content,
            })),
          }),
        });

        // Manejo específico de la respuesta
        const contentType = res.headers.get("content-type");
        
        if (!res.ok) {
          // Si el servidor envía un JSON con error (como el 503 de cuota agotada)
          if (contentType?.includes("application/json")) {
            const errorData = await res.json();
            throw new Error(errorData.error || "Error del servidor");
          }
          throw new Error("Error de conexión");
        }

        const reader = res.body?.getReader();
        const decoder = new TextDecoder();

        if (!reader) throw new Error("No se pudo leer la respuesta");

        let buffer = "";
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() || "";

          for (const line of lines) {
            if (line.startsWith('0:"') || line.startsWith("0:\"")) {
              try {
                const parsed = JSON.parse(line.slice(2));
                setMessages((prev) =>
                  prev.map((m) =>
                    m.id === assistantId
                      ? { ...m, content: m.content + parsed }
                      : m
                  )
                );
              } catch {
                // fragmento incompleto
              }
            }
          }
        }
      } catch (err: any) {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId
              ? { 
                  ...m, 
                  content: err.message.includes("saturados") 
                    ? "¡Vaya! He hablado demasiado por hoy y Google ha limitado mis respuestas. Por favor, inténtalo de nuevo en unos minutos o contáctame directamente en sergiregany1996@gmail.com."
                    : "Lo siento, ha habido un problema técnico. ¿Podrías repetirlo?" 
                }
              : m
          )
        );
      } finally {
        setIsLoading(false);
      }
    },
    [messages]
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const val = input.trim();
    if (!val || isLoading) return;
    setInput("");
    sendMessage(val);
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
            className="fixed bottom-4 right-4 left-4 sm:left-auto sm:right-6 sm:bottom-24 w-auto sm:w-[420px] max-h-[85vh] h-[550px] sm:h-[600px] bg-black/95 backdrop-blur-2xl border border-white/10 rounded-2xl sm:rounded-3xl shadow-2xl z-[160] flex flex-col overflow-hidden"
          >
            <div className="p-4 sm:p-6 border-b border-white/10 flex justify-between items-center bg-white/5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-brand-cyan/20 flex items-center justify-center border border-brand-cyan/30">
                  <Bot className="text-brand-cyan w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-white font-bold text-sm">Sergi AI Assistant</h3>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-[10px] text-white/40 uppercase tracking-widest font-bold">
                      Online
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <a
                  href="mailto:sergiregany1996@gmail.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hidden sm:inline-block text-[10px] bg-brand-cyan/10 border border-brand-cyan/30 text-brand-cyan px-2.5 py-1 rounded-full font-bold uppercase tracking-wider hover:bg-brand-cyan hover:text-black transition-colors"
                >
                  Contactar
                </a>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 text-white/40 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 scroll-smooth">
              {messages.map((m) => (
                <motion.div
                  key={m.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div className={`flex gap-3 max-w-[88%] ${m.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 border ${m.role === "user" ? "bg-white/10 border-white/20" : "bg-brand-cyan/10 border-brand-cyan/20"}`}>
                      {m.role === "user" ? <span className="text-[11px] text-white/60 font-bold uppercase">Tú</span> : <Sparkles className="w-4 h-4 text-brand-cyan" />}
                    </div>
                    <div className={`p-3.5 sm:p-4 rounded-2xl text-xs leading-relaxed ${m.role === "user" ? "bg-brand-cyan text-black font-medium" : "bg-white/5 text-white/90 border border-white/10 space-y-2"}`}>
                      <p className="whitespace-pre-wrap">{m.content}</p>
                      {m.role === "assistant" && (m.content.includes("sergiregany1996@gmail.com") || m.content.includes("contactar") || m.content.includes("LinkedIn")) && (
                        <div className="pt-2 flex flex-wrap gap-2">
                          <a
                            href="mailto:sergiregany1996@gmail.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-[10px] bg-brand-cyan text-black px-3 py-1 rounded-full font-bold uppercase tracking-wider hover:brightness-110 transition-all"
                          >
                            ✉️ Enviar Email
                          </a>
                          <a
                            href="https://www.linkedin.com/in/sregany/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-[10px] bg-white/10 border border-white/20 text-white px-3 py-1 rounded-full font-bold uppercase tracking-wider hover:bg-white/20 transition-all"
                          >
                            🔗 LinkedIn
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
              {isLoading && (
                <div className="flex items-center gap-2 text-brand-cyan text-[10px] font-bold uppercase tracking-widest p-2">
                  <span className="flex gap-1">
                    <span className="w-1 h-1 rounded-full bg-brand-cyan animate-bounce [animation-delay:-0.3s]" />
                    <span className="w-1 h-1 rounded-full bg-brand-cyan animate-bounce [animation-delay:-0.15s]" />
                    <span className="w-1 h-1 rounded-full bg-brand-cyan animate-bounce" />
                  </span>
                  PROCESANDO
                </div>
              )}
            </div>

            {/* Quick Action Suggestion Chips */}
            <div className="px-4 py-2 bg-white/[0.02] border-t border-white/5 flex gap-2 overflow-x-auto no-scrollbar">
              {[
                "ERP INVESTFINCA",
                "NexusAI SaaS",
                "Stack técnico",
                "✉️ Contactar con Sergi"
              ].map((chip, idx) => (
                <button
                  key={idx}
                  onClick={() => sendMessage(chip)}
                  disabled={isLoading}
                  className="text-[10px] bg-white/5 hover:bg-brand-cyan/20 border border-white/10 hover:border-brand-cyan/40 text-white/70 hover:text-brand-cyan px-2.5 py-1 rounded-full whitespace-nowrap transition-all cursor-pointer disabled:opacity-30"
                >
                  {chip}
                </button>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="p-4 sm:p-6 bg-white/5 border-t border-white/10">
              <div className="relative">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Pregunta sobre Sergi o cómo contactarle..."
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 sm:py-4 pl-4 sm:pl-6 pr-12 sm:pr-14 text-xs text-white focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={isLoading || !input.trim()}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 sm:p-2.5 bg-brand-cyan text-black rounded-xl cursor-pointer disabled:opacity-30 transition-all shadow-[0_0_15px_rgba(0,242,254,0.3)]"
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
}