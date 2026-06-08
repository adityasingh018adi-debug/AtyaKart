import { ReactNode } from "react";
import { LucideIcon } from "lucide-react";

export default function InfoPage({
  icon: Icon,
  title,
  subtitle,
  children,
}: {
  icon: LucideIcon;
  title: string;
  subtitle: string;
  children: ReactNode;
}) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="flex items-center gap-3">
        <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <Icon size={22} />
        </span>
        <div>
          <h1 className="font-heading text-2xl font-extrabold tracking-tight text-dark sm:text-3xl">
            {title}
          </h1>
          <p className="text-sm text-dark/50">{subtitle}</p>
        </div>
      </div>
      <div className="prose prose-sm mt-8 max-w-none space-y-6 text-dark/70 [&_h2]:font-heading [&_h2]:text-lg [&_h2]:font-bold [&_h2]:text-dark [&_li]:list-disc [&_li]:ml-5 [&_p]:leading-relaxed">
        {children}
      </div>
    </div>
  );
}
