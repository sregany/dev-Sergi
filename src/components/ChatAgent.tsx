"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, X, Send, Bot, User, Sparkles } from "lucide-react";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
}

const ChatAgent = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [userInput, setUserInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      role: "assistant",
      content: "Hello! I'm Sergi's AI assistant. Ask me anything about his projects, skills, or how to get in touch!",
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!userInput.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: userInput,
    };

    setMessages((prev) => [...prev, userMsg]);
    setUserInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [...messages, userMsg] }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Error en la respuesta");
      }

      setMessages((prev) => [
        ...prev,
        {
          id: `asst-${Date.now()}`,
          role: "assistant",
          content: data.text,
        },
      ]);
    } catch (error: any) {
      console.error("Chat Error:", error);
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          role: "assistant",
          content: "⚠️ Error: " + error.message,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-brand-cyan text-bg-dark rounded-full shadow-lg flex items-center justify-center z-50 hover:scale-110 active:scale-95 transition-all group"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
              <X size={24} />
            </motion.div>
          ) : (
            <motion.div key="open" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }}>
              <MessageSquare size={24} />
            </motion.div>
          )}
        </AnimatePresence>
      </button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-24 right-6 w-[calc(100vw-48px)] sm:w-96 h-[500px] bg-[#0A0A0B]/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl flex flex-col z-50 overflow-hidden"
          >
            {/* Header */}
            <div className="p-4 border-b border-white/5 bg-white/5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-brand-cyan/20 flex items-center justify-center border border-brand-cyan/30">
                  <Bot size={20} className="text-brand-cyan" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-sm tracking-widest text-white">SR_AGENT</h3>
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-[#00FF85] animate-pulse" />
                    <span className="text-[10px] text-white/40 uppercase font-mono">Personal AI Assistant</span>
                  </div>
                </div>
              </div>
              <Sparkles size={16} className="text-brand-cyan/40 shadow-sm" />
            </div>

            {/* Messages Area */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-hide">
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`flex gap-3 max-w-[85%] ${message.role === "user" ? "flex-row-reverse" : ""}`}>
                    <div className={`w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center border ${
                      message.role === "user" ? "bg-brand-purple/20 border-brand-purple/40" : "bg-brand-cyan/20 border-brand-cyan/40"
                    }`}>
                      {message.role === "user" ? <User size={16} className="text-brand-purple" /> : <Bot size={16} className="text-brand-cyan" />}
                    </div>
                    <div className={`p-3.5 rounded-2xl text-[13px] leading-relaxed shadow-lg ${
                      message.role === "user" 
                        ? "bg-brand-purple/10 border border-brand-purple/20 text-white rounded-tr-none" 
                        : "bg-white/5 border border-white/10 text-white/90 rounded-tl-none whitespace-pre-wrap"
                    }`}>
                      {message.content}
                    </div>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-lg bg-brand-cyan/20 border border-brand-cyan/40 flex items-center justify-center">
                    <Bot size={16} className="text-brand-cyan" />
                  </div>
                  <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 text-white/40 text-[10px] uppercase font-mono tracking-widest flex items-center gap-2">
                    <span>GENERATING</span>
                    <span className="flex gap-0.5">
                      <span className="animate-bounce" style={{ animationDelay: "0s" }}>.</span>
                      <span className="animate-bounce" style={{ animationDelay: "0.2s" }}>.</span>
                      <span className="animate-bounce" style={{ animationDelay: "0.4s" }}>.</span>
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white/5 border-t border-white/5">
              <div className="relative group">
                <input
                  type="text"
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  placeholder="Ask me something..."
                  disabled={isLoading}
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-5 py-3.5 text-xs text-white placeholder:text-white/20 focus:outline-none focus:border-brand-cyan/50 transition-all font-mono"
                />
                <button
                  onClick={handleSend}
                  disabled={isLoading}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-white/40 hover:text-brand-cyan transition-colors disabled:opacity-50"
                >
                  <Send size={16} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ChatAgent;
