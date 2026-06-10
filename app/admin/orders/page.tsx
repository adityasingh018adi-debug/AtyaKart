import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: { user: { select: { name: true, email: true, phone: true } } },
  });

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-fg">Orders</h1>
      <p className="mt-1 text-sm text-fg/50">{orders.length} order{orders.length === 1 ? "" : "s"} placed.</p>

      <div className="mt-6 overflow-hidden rounded-2xl border border-dark/10 bg-surface">
        {orders.length === 0 ? (
          <p className="p-8 text-center text-sm text-fg/40">No orders yet.</p>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="bg-dark/5 text-xs uppercase tracking-wide text-fg/50">
              <tr>
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Total</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Placed</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-t border-dark/5">
                  <td className="px-4 py-3 font-medium text-fg">
                    {order.user.name ?? order.user.email ?? order.user.phone ?? "Guest"}
                  </td>
                  <td className="px-4 py-3">{formatPrice(order.total)}</td>
                  <td className="px-4 py-3 capitalize">{order.status}</td>
                  <td className="px-4 py-3 text-fg/50">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
