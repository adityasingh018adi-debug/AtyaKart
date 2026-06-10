"use client";

import { ReactNode, createContext, useContext, useState } from "react";
import Navbar from "@/components/layout/Navbar";
import CategoryBar from "@/components/layout/CategoryBar";
import Footer from "@/components/layout/Footer";
import Toast from "@/components/ui/Toast";
import AITryOnModal from "@/components/ai/AITryOnModal";
import ChatAssistant from "@/components/ai/ChatAssistant";
import SmoothScroll from "@/components/layout/SmoothScroll";
import PWARegister from "@/components/layout/PWARegister";
import ReferralBanner from "@/components/layout/ReferralBanner";

const AIModalContext = createContext<() => void>(() => {});
export const useAIModal = () => useContext(AIModalContext);

export default function LayoutShell({ children }: { children: ReactNode }) {
  const [aiOpen, setAiOpen] = useState(false);
  const openAI = () => setAiOpen(true);

  return (
    <AIModalContext.Provider value={openAI}>
      <SmoothScroll>
        <PWARegister />
        <ReferralBanner />
        <Navbar onOpenAI={openAI} />
        <CategoryBar />
        <main className="flex-1">{children}</main>
        <Footer />
        <Toast />
        <AITryOnModal open={aiOpen} onClose={() => setAiOpen(false)} />
        <ChatAssistant />
      </SmoothScroll>
    </AIModalContext.Provider>
  );
}
