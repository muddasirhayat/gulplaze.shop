import { prisma } from "@/lib/prisma";
import { getStaffSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { formatPkr } from "@/lib/money";
import Link from "next/link";

export default async function AdminHome() {
  const session = await getStaffSession();
  if (!session) redirect("/admin/login");

  const start = new Date();
  start.setHours(0, 0, 0, 0);
  const [ordersToday, revenue, lowStock, recent, inbox] = await Promise.all([
    prisma.order.count({ where: { createdAt: { gte: start } } }),
    prisma.order.aggregate({ _sum: { total: true }, where: { createdAt: { gte: start } } }),
    prisma.productVariant.count({ where: { stock: { lte: 5 } } }),
    prisma.order.findMany({ orderBy: { createdAt: "desc" }, take: 8 }),
    prisma.notificationInbox.findMany({ orderBy: { createdAt: "desc" }, take: 5 }),
  ]);
  const top = await prisma.orderItem.groupBy({
    by: ["title"],
    _sum: { quantity: true },
    orderBy: { _sum: { quantity: "desc" } },
    take: 5,
  });

  return (
    <div>
      <h1 className="font-serif text-3xl">Today</h1>
      <div className="mt-6 grid gap-4 md:grid-cols-4">
        {[
          ["Orders", String(ordersToday)],
          ["Revenue", formatPkr(revenue._sum.total ?? 0)],
          ["Low stock", String(lowStock)],
          ["Inbox", String(inbox.length)],
        ].map(([l, v]) => (
          <div key={l} className="rounded-3xl bg-white p-5">
            <p className="text-sm text-muted">{l}</p>
            <p className="mt-1 font-serif text-2xl">{v}</p>
          </div>
        ))}
      </div>
      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="rounded-3xl bg-white p-5">
          <h2 className="font-serif text-xl">Recent orders</h2>
          <ul className="mt-3 space-y-2 text-sm">
            {recent.map((o) => (
              <li key={o.id}>
                <Link href={`/admin/orders/${o.id}`} className="underline">
                  {o.number}
                </Link>{" "}
                · {o.fullName} · {formatPkr(o.total)}
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-3xl bg-white p-5">
          <h2 className="font-serif text-xl">Top products</h2>
          <ul className="mt-3 space-y-2 text-sm">
            {top.map((t) => (
              <li key={t.title}>
                {t.title} · {t._sum.quantity}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
