import { Sparkles } from "lucide-react";
import InfoPage from "@/components/ui/InfoPage";

export default function AboutPage() {
  return (
    <InfoPage
      icon={Sparkles}
      title="Our Story"
      subtitle="Fashion for every story — built by people who love clothes and hate guesswork."
    >
      <p>
        AtyaKart started with a simple frustration: online shopping for clothes meant ordering
        three sizes and returning two. So we set out to fix it — pairing premium Indian fashion
        with AI-powered sizing that learns your shape and recommends the fit that actually works
        for you.
      </p>
      <p>
        Today we curate collections across Men&apos;s, Women&apos;s, Kids&apos;, and ZenG wellness
        wear, working with makers and studios across India who care as much about craft as we do
        about fit. Every piece is chosen to be worn, loved, and lived in — not returned.
      </p>
      <h2>What we stand for</h2>
      <ul>
        <li><span className="font-semibold text-fg">Fit, solved.</span> Our AI Fitting Room turns a quick photo into a size you can trust.</li>
        <li><span className="font-semibold text-fg">Fewer returns, less waste.</span> Better sizing means fewer wrong orders and a smaller footprint.</li>
        <li><span className="font-semibold text-fg">Real stories, real people.</span> From #AtyaKartStyle to verified reviews, our community shapes what we sell.</li>
      </ul>
      <p>We&apos;re just getting started — thanks for being part of the journey.</p>
    </InfoPage>
  );
}
