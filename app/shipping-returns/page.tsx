import { Truck } from "lucide-react";
import InfoPage from "@/components/ui/InfoPage";

export default function ShippingReturnsPage() {
  return (
    <InfoPage
      icon={Truck}
      title="Shipping & Returns"
      subtitle="Everything you need to know about getting your order, and sending it back if needed."
    >
      <h2>Shipping</h2>
      <ul>
        <li>Free delivery on all orders over ₹999 — a flat ₹49 fee applies below that.</li>
        <li>Orders are dispatched within 24 hours and arrive in 3–6 business days.</li>
        <li>We currently ship across India, including most pin codes serviced by our courier partners.</li>
        <li>You&apos;ll receive a tracking link by email and SMS as soon as your order ships.</li>
      </ul>

      <h2>Returns & Exchanges</h2>
      <ul>
        <li>Most items can be returned within 7 days of delivery, unworn and with original tags.</li>
        <li>Start a return from My Orders, or reach out via Contact Us and we&apos;ll guide you.</li>
        <li>Once we receive and inspect your return, refunds are issued to your original payment method within 5–7 business days.</li>
        <li>Sale items, innerwear, and customised pieces are final sale and can&apos;t be returned.</li>
      </ul>

      <h2>Damaged or wrong items</h2>
      <p>
        If something arrives damaged or isn&apos;t what you ordered, contact us within 48 hours of
        delivery with photos of the item and packaging — we&apos;ll arrange a free replacement or
        refund, no questions asked.
      </p>
    </InfoPage>
  );
}
