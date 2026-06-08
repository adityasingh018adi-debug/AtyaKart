import { Leaf } from "lucide-react";
import InfoPage from "@/components/ui/InfoPage";

export default function SustainabilityPage() {
  return (
    <InfoPage
      icon={Leaf}
      title="Sustainability"
      subtitle="Better fit, fewer returns, lighter footprint — sustainability starts with getting it right the first time."
    >
      <p>
        Fashion&apos;s biggest hidden cost isn&apos;t always the fabric — it&apos;s the returns,
        re-shipping, and waste created when an order doesn&apos;t fit. Our AI Fitting Room exists
        to cut that down at the source, so fewer packages travel back and forth and fewer garments
        end up unworn.
      </p>
      <h2>What we're doing</h2>
      <ul>
        <li><span className="font-semibold text-dark">Smarter sizing.</span> AI-powered recommendations reduce wrong-size orders and the returns that come with them.</li>
        <li><span className="font-semibold text-dark">Conscious materials.</span> Our ZenG line is built around organic cotton, linen, and other low-impact fabrics.</li>
        <li><span className="font-semibold text-dark">Responsible packaging.</span> We&apos;re moving toward recyclable and minimal packaging across all shipments.</li>
        <li><span className="font-semibold text-dark">Considered partners.</span> We work with makers and studios who share our standards on labour and craft.</li>
      </ul>
      <p>
        We don&apos;t have it all figured out yet, but every collection and every feature we ship
        is a step toward fashion that lasts longer and travels lighter.
      </p>
    </InfoPage>
  );
}
