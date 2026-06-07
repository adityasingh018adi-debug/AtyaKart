"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { MessageCircle, X, Send, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

type ChatMessage = { role: "user" | "assistant"; content: string };

const GREETING: ChatMessage = {
  role: "assistant",
  content:
    "Hi! I'm your AtyaKart AI Fashion Assistant. Ask me for outfit ideas, sizing tips, or what to wear for an occasion — I'll point you to the right pieces.",
};

const QUICK_PROMPTS = [
  "What should I wear to a wedding?",
  "Suggest an everyday office outfit",
  "What's trending for women right now?",
];

export default function ChatAssistant() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([GREETING]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  const send = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || loading) return;

    const nextMessages = [...messages, { role: "user" as const, content: trimmed }];
    setMessages(nextMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/ai-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: trimmed, history: nextMessages.slice(0, -1) }),
      });
      const data = await res.json();
      setMessages((prev) => [...prev, { role: "assistant", content: data.reply ?? "Sorry, I couldn't think of anything just now — try asking another way?" }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Something went wrong on my end — please try again in a moment." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <motion.button
        onClick={() => setOpen((v) => !v)}
        whileTap={{ scale: 0.92 }}
        className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-r from-primary to-accent text-white shadow-lg shadow-primary/30 transition hover:opacity-90"
        aria-label="Open AI Fashion Assistant"
      >
        {open ? <X size={24} /> : <MessageCircle size={24} />}
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-24 right-5 z-50 flex h-[28rem] w-[22rem] max-w-[calc(100vw-2.5rem)] flex-col overflow-hidden rounded-3xl border border-dark/10 bg-white shadow-2xl"
          >
            <div className="flex items-center gap-2.5 bg-gradient-to-r from-primary to-accent px-4 py-3 text-white">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20">
                <Sparkles size={16} />
              </span>
              <div>
                <p className="text-sm font-bold">AI Fashion Assistant</p>
                <p className="text-[11px] text-white/80">Your personal stylist, online now</p>
              </div>
            </div>

            <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-4 scrollbar-none">
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={cn(
                    "max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed",
                    m.role === "user"
                      ? "ml-auto bg-primary text-white"
                      : "bg-dark/5 text-dark"
                  )}
                >
                  {m.content}
                </div>
              ))}
              {loading && (
                <div className="flex w-fit items-center gap-1 rounded-2xl bg-dark/5 px-3.5 py-2.5">
                  {[0, 1, 2].map((i) => (
                    <span
                      key={i}
                      className="h-1.5 w-1.5 animate-bounce rounded-full bg-dark/40"
                      style={{ animationDelay: `${i * 0.12}s` }}
                    />
                  ))}
                </div>
              )}
            </div>

            {messages.length <= 1 && (
              <div className="flex flex-wrap gap-1.5 px-4 pb-2">
                {QUICK_PROMPTS.map((p) => (
                  <button
                    key={p}
                    onClick={() => send(p)}
                    className="rounded-full border border-dark/15 px-2.5 py-1 text-xs font-medium text-dark/60 transition hover:border-primary/40 hover:text-primary"
                  >
                    {p}
                  </button>
                ))}
              </div>
            )}

            <form
              onSubmit={(e) => {
                e.preventDefault();
                send(input);
              }}
              className="flex items-center gap-2 border-t border-dark/10 p-3"
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about styles, sizing, occasions…"
                className="w-full rounded-full border border-dark/15 bg-white px-4 py-2 text-sm text-dark placeholder:text-dark/40 focus:border-primary/50 focus:outline-none"
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-primary to-accent text-white transition disabled:opacity-40"
                aria-label="Send message"
              >
                <Send size={15} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
