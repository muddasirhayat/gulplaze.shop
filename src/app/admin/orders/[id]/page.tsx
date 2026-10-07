import { prisma } from "@/lib/prisma";
import { getStaffSession } from "@/lib/auth";
import { notFound, redirect } from "next/navigation";
import { formatPkr } from "@/lib/money";
import { bookCourier, updateOrderStatus } from "@/actions/admin";
import { ORDER_STATUSES } from "@/lib/constants";

export default async function OrderDetail({ params }: { params: Promise<{ id: string }> }) {
  const session = await getStaffSession();
  if (!session) redirect("/admin/login");
  const { id } = await params;
  const order = await prisma.order.findUnique({
    where: { id },
    include: { items: true, payments: true, history: true, shipments: true },
  });
  if (!order) notFound();
  return (
    <div className="max-w-3xl">
      <h1 className="font-serif text-3xl">{order.number}</h1>
      <p className="text-muted">
        {order.fullName} · {order.phone} · {order.area}, {order.city}
      </p>
      <p className="mt-2 font-semibold">{formatPkr(order.total)}</p>
      <ul className="mt-6 space-y-2 text-sm">
        {order.items.map((i) => (
          <li key={i.id}>
            {i.title} × {i.quantity} — {formatPkr(i.price * i.quantity)}
          </li>
        ))}
      </ul>
      <div className="mt-6 flex flex-wrap gap-2">
        {ORDER_STATUSES.map((s) => (
          <form key={s} action={updateOrderStatus.bind(null, order.id, s)}>
            <button className={`rounded-full px-3 py-1 text-sm ${order.status === s ? "bg-[#a8c3a0]" : "bg-white"}`}>
              {s.replaceAll("_", " ")}
            </button>
          </form>
        ))}
      </div>
      <div className="mt-6 flex gap-2">
        {(["tcs", "leopards"] as const).map((c) => (
          <form key={c} action={bookCourier.bind(null, order.id, c)}>
            <button className="rounded-full bg-white px-4 py-2 text-sm">Book {c}</button>
          </form>
        ))}
      </div>
      <a className="mt-6 inline-block text-sm underline" href={`/admin/orders/${order.id}/print`}>
        Print invoice / packing slip
      </a>
    </div>
  );
}
