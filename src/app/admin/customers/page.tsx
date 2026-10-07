import { prisma } from "@/lib/prisma";
import { getStaffSession } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function CustomersPage() {
  const session = await getStaffSession();
  if (!session) redirect("/admin/login");
  const customers = await prisma.user.findMany({
    where: { role: "customer" },
    include: { _count: { select: { orders: true } } },
    orderBy: { createdAt: "desc" },
  });
  return (
    <div>
      <h1 className="font-serif text-3xl">Customers</h1>
      <ul className="mt-6 space-y-2">
        {customers.map((c) => (
          <li key={c.id} className="rounded-2xl bg-white p-4">
            {c.name} · {c.email} · {c.phone} · {c._count.orders} orders · {c.loyaltyPoints} pts
          </li>
        ))}
      </ul>
    </div>
  );
}
