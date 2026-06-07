"use client";

import { ReactNode, createContext, useContext, useState } from "react";
import Navbar from "@/components/layout/Navbar";
import CategoryBar from "@/components/layout/CategoryBar";
import Footer from "@/components/layout/Footer";
import Toast from "@/components/ui/Toast";
import AITryOnModal from "@/components/ai/AITryOnModal";

const AIModalContext = createContext<() => void>(() => {});
export const useAIModal = () => useContext(AIModalContext);

export default function LayoutShell({ children }: { children: ReactNode }) {
  const [aiOpen, setAiOpen] = useState(false);
  const openAI = () => setAiOpen(true);

  return (
    <AIModalContext.Provider value={openAI}>
      <Navbar onOpenAI={openAI} />
      <CategoryBar />
      <main className="flex-1">{children}</main>
      <Footer />
      <Toast />
      <AITryOnModal open={aiOpen} onClose={() => setAiOpen(false)} />
    </AIModalContext.Provider>
  );
}
