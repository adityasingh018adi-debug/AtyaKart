"use client";

import { useAIModal } from "@/components/layout/LayoutShell";
import HeroSection from "@/components/home/HeroSection";
import DealsStrip from "@/components/home/DealsStrip";
import TrustStrip from "@/components/home/TrustStrip";
import CategoryShowcase from "@/components/home/CategoryShowcase";
import AIBanner from "@/components/home/AIBanner";
import ProductsSection from "@/components/home/ProductsSection";
import AIRecommended from "@/components/home/AIRecommended";
import FlashSale from "@/components/home/FlashSale";
import BudgetPicks from "@/components/home/BudgetPicks";
import NewArrivals from "@/components/home/NewArrivals";
import RecentlyViewed from "@/components/home/RecentlyViewed";
import CompleteTheLook from "@/components/home/CompleteTheLook";
import Testimonials from "@/components/home/Testimonials";
import InstagramGallery from "@/components/home/InstagramGallery";

export default function Home() {
  const openAI = useAIModal();

  return (
    <div>
      <HeroSection onOpenAI={openAI} />
      <DealsStrip />
      <TrustStrip />
      <CategoryShowcase />
      <BudgetPicks />
      <ProductsSection />
      <AIRecommended />
      <FlashSale />
      <AIBanner onOpenAI={openAI} />
      <NewArrivals />
      <RecentlyViewed />
      <CompleteTheLook />
      <Testimonials />
      <InstagramGallery />
    </div>
  );
}
