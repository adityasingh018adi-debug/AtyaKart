import { prisma } from "@/lib/prisma";
import Badge from "@/components/ui/Badge";

export default async function AdminUsersPage() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: { id: true, name: true, email: true, phone: true, role: true, createdAt: true },
  });

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-dark">Users</h1>
      <p className="mt-1 text-sm text-dark/50">{users.length} registered user{users.length === 1 ? "" : "s"}.</p>

      <div className="mt-6 overflow-hidden rounded-2xl border border-dark/10 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-dark/5 text-xs uppercase tracking-wide text-dark/50">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Phone</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3">Joined</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-t border-dark/5">
                <td className="px-4 py-3 font-medium text-dark">{user.name ?? "—"}</td>
                <td className="px-4 py-3 text-dark/60">{user.email ?? "—"}</td>
                <td className="px-4 py-3 text-dark/60">{user.phone ?? "—"}</td>
                <td className="px-4 py-3">
                  {user.role === "ADMIN" ? (
                    <Badge label="ADMIN" className="bg-primary text-white" />
                  ) : (
                    <span className="text-dark/50">User</span>
                  )}
                </td>
                <td className="px-4 py-3 text-dark/50">
                  {new Date(user.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
