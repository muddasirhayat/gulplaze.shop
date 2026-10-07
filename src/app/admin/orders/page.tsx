import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getStaffSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { formatPkr } from "@/lib/money";

export default async function OrdersAdmin({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; q?: string }>;
}) {
  const session = await getStaffSession();
  if (!session) redirect("/admin/login");
  const { status, q } = await searchParams;
  const orders = await prisma.order.findMany({
    where: {
      ...(status ? { status } : {}),
      ...(q ? { OR: [{ number: { contains: q } }, { phone: { contains: q } }, { fullName: { contains: q } }] } : {}),
    },
    orderBy: { createdAt: "desc" },
    take: 50,
  });
  return (
    <div>
      <h1 className="font-serif text-3xl">Orders</h1>
      <form className="mt-4 flex gap-2">
        <input name="q" defaultValue={q} placeholder="Search number, name, phone" className="h-11 flex-1 rounded-full border px-4" />
        <select name="status" defaultValue={status} className="h-11 rounded-full border px-3">
          <option value="">All</option>
          {["pending_confirmation", "confirmed", "packed", "shipped", "delivered", "cancelled"].map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
      </form>
      <ul className="mt-6 space-y-2">
        {orders.map((o) => (
          <li key={o.id} className="rounded-2xl bg-white p-4">
            <Link href={`/admin/orders/${o.id}`} className="font-medium underline">
              {o.number}
            </Link>
            <span className="text-sm text-muted">
              {" "}
              · {o.fullName} · {o.city} · {formatPkr(o.total)} · {o.status} · {o.paymentMethod}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
