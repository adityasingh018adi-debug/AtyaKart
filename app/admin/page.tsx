import Link from "next/link";
import { Package, ShoppingBag, Users, TrendingUp } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";

export default async function AdminDashboardPage() {
  const [productCount, orderCount, userCount, orders] = await Promise.all([
    prisma.product.count(),
    prisma.order.count(),
    prisma.user.count(),
    prisma.order.findMany({ select: { total: true } }),
  ]);

  const revenue = orders.reduce((sum, o) => sum + o.total, 0);

  const stats = [
    { label: "Products", value: productCount, icon: Package, href: "/admin/products" },
    { label: "Orders", value: orderCount, icon: ShoppingBag, href: "/admin/orders" },
    { label: "Users", value: userCount, icon: Users, href: "/admin/users" },
    { label: "Revenue", value: formatPrice(revenue), icon: TrendingUp, href: "/admin/orders" },
  ];

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-fg">Dashboard</h1>
      <p className="mt-1 text-sm text-fg/50">Overview of your AtyaKart store.</p>

      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {stats.map(({ label, value, icon: Icon, href }) => (
          <Link
            key={label}
            href={href}
            className="rounded-2xl border border-dark/10 bg-surface p-4 transition hover:border-primary/30 hover:shadow-sm"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Icon size={18} />
            </div>
            <p className="mt-3 text-xl font-bold text-fg">{value}</p>
            <p className="text-xs text-fg/50">{label}</p>
          </Link>
        ))}
      </div>

      <div className="mt-8 rounded-2xl border border-dark/10 bg-surface p-5">
        <h2 className="font-display text-base font-bold text-fg">Quick actions</h2>
        <div className="mt-3 flex flex-wrap gap-3">
          <Link
            href="/admin/products"
            className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-[#c91e24]"
          >
            Manage products
          </Link>
          <Link
            href="/admin/products?new=1"
            className="rounded-full border border-dark/15 px-4 py-2 text-sm font-semibold text-fg hover:border-dark/40"
          >
            Add a new product
          </Link>
        </div>
      </div>
    </div>
  );
}
