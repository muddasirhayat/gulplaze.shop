import { prisma } from "@/lib/prisma";
import { getStaffSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { formatPkr } from "@/lib/money";

export default async function ReportsPage() {
  const session = await getStaffSession();
  if (!session) redirect("/admin/login");
  const [byCity, abandoned, coupons, profit] = await Promise.all([
    prisma.order.groupBy({ by: ["city"], _sum: { total: true }, _count: true }),
    prisma.cart.count({ where: { items: { some: {} }, recovered: false, updatedAt: { lt: new Date(Date.now() - 3600_000) } } }),
    prisma.coupon.findMany(),
    prisma.order.aggregate({ _sum: { total: true, discount: true } }),
  ]);
  return (
    <div>
      <h1 className="font-serif text-3xl">Reports</h1>
      <p className="mt-2 text-muted">Sales {formatPkr(profit._sum.total ?? 0)} · discounts {formatPkr(profit._sum.discount ?? 0)}</p>
      <h2 className="mt-8 font-serif text-2xl">City wise</h2>
      <ul className="mt-3 space-y-2">
        {byCity.map((c) => (
          <li key={c.city} className="rounded-2xl bg-white p-4">
            {c.city} · {c._count} orders · {formatPkr(c._sum.total ?? 0)}
          </li>
        ))}
      </ul>
      <p className="mt-8">Abandoned carts (approx): {abandoned}</p>
      <h2 className="mt-8 font-serif text-2xl">Coupons</h2>
      <ul className="mt-3">
        {coupons.map((c) => (
          <li key={c.id}>
            {c.code}: {c.usedCount} uses
          </li>
        ))}
      </ul>
    </div>
  );
}
