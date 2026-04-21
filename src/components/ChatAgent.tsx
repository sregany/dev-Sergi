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
            className="fixed bottom-24 right-6 w-[90vw] sm:w-[420px] h-[600px] bg-black/90 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-2xl z-[160] flex flex-col overflow-hidden"
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
                    <span className="text-[10px] text-white/40 uppercase tracking-widest font-bold">
                      Online
                    </span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 text-white/40 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth">
              {messages.map((m) => (
                <motion.div
                  key={m.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div className={`flex gap-3 max-w-[85%] ${m.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 border ${m.role === "user" ? "bg-white/10 border-white/20" : "bg-brand-cyan/10 border-brand-cyan/20"}`}>
                      {m.role === "user" ? <span className="text-[11px] text-white/60 font-bold uppercase">Tú</span> : <Sparkles className="w-4 h-4 text-brand-cyan" />}
                    </div>
                    <div className={`p-4 rounded-2xl text-xs leading-relaxed ${m.role === "user" ? "bg-brand-cyan text-black font-medium" : "bg-white/5 text-white/80 border border-white/10"}`}>
                      {m.content}
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

            <form onSubmit={handleSubmit} className="p-6 bg-white/5 border-t border-white/10">
              <div className="relative">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Pregunta sobre Sergi..."
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-6 pr-14 text-xs text-white focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={isLoading || !input.trim()}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2.5 bg-brand-cyan text-black rounded-xl cursor-pointer disabled:opacity-30 transition-all shadow-[0_0_15px_rgba(0,242,254,0.3)]"
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