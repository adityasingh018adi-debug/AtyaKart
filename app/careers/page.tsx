import { Briefcase, Mail } from "lucide-react";
import InfoPage from "@/components/ui/InfoPage";

const openings = [
  { role: "Frontend Engineer", team: "Product & Engineering", location: "Remote / Mumbai" },
  { role: "Fashion Buyer — Women's", team: "Merchandising", location: "Mumbai" },
  { role: "Performance Marketer", team: "Growth", location: "Remote" },
  { role: "Customer Experience Associate", team: "Support", location: "Bengaluru" },
];

export default function CareersPage() {
  return (
    <InfoPage
      icon={Briefcase}
      title="Careers at AtyaKart"
      subtitle="Help us build the future of fashion — where everything fits, the first time."
    >
      <p>
        We&apos;re a small, fast-moving team obsessed with great clothes and great technology. If
        you care about craft, fit, and building things people love to use, we&apos;d love to hear
        from you — even if you don&apos;t see a role that matches below.
      </p>

      <h2>Open roles</h2>
      <div className="not-prose space-y-2">
        {openings.map((o) => (
          <div
            key={o.role}
            className="flex flex-col gap-1 rounded-2xl border border-dark/10 p-4 sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <p className="font-semibold text-fg">{o.role}</p>
              <p className="text-xs text-fg/50">{o.team}</p>
            </div>
            <span className="rounded-full bg-dark/5 px-3 py-1 text-xs font-medium text-fg/60">
              {o.location}
            </span>
          </div>
        ))}
      </div>

      <h2>How to apply</h2>
      <p className="not-prose flex items-center gap-2 text-sm text-fg/70">
        <Mail size={16} className="text-primary" />
        Send your resume and a short note to{" "}
        <span className="font-semibold text-fg">careers@atyakart.in</span> with the role you&apos;re
        interested in.
      </p>
    </InfoPage>
  );
}
