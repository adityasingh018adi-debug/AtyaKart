import Link from "next/link";
import { redirect } from "next/navigation";
import { LayoutDashboard, Package, ShoppingBag, Users, ArrowLeft } from "lucide-react";
import { auth } from "@/auth";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/orders", label: "Orders", icon: ShoppingBag },
  { href: "/admin/users", label: "Users", icon: Users },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/login?callbackUrl=/admin");
  }

  return (
    <div className="mx-auto flex min-h-[80vh] max-w-7xl gap-6 px-4 py-8 sm:px-6 lg:px-8">
      <aside className="hidden w-56 shrink-0 lg:block">
        <div className="sticky top-24 rounded-2xl border border-dark/10 bg-surface p-4">
          <p className="px-2 text-xs font-semibold uppercase tracking-wide text-fg/40">
            Admin Panel
          </p>
          <p className="mb-4 px-2 text-sm font-semibold text-fg">{session.user.name ?? session.user.email}</p>
          <nav className="space-y-1">
            {navItems.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-medium text-fg/70 transition hover:bg-primary/5 hover:text-primary"
              >
                <Icon size={16} />
                {label}
              </Link>
            ))}
          </nav>
          <Link
            href="/"
            className="mt-4 flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-medium text-fg/50 transition hover:bg-dark/5"
          >
            <ArrowLeft size={16} />
            Back to store
          </Link>
        </div>
      </aside>
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}
