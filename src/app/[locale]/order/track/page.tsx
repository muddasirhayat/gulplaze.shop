import { prisma } from "@/lib/prisma";
import { formatPkr } from "@/lib/money";

export default async function TrackPage({
  searchParams,
}: {
  searchParams: Promise<{ number?: string; phone?: string }>;
}) {
  const sp = await searchParams;
  const order =
    sp.number && sp.phone
      ? await prisma.order.findFirst({
          where: { number: sp.number, phone: sp.phone },
          include: { history: { orderBy: { createdAt: "asc" } } },
        })
      : null;
  return (
    <div className="container-gp max-w-lg py-16">
      <h1 className="font-serif text-4xl">Track order</h1>
      <form className="mt-6 space-y-3">
        <input name="number" defaultValue={sp.number} placeholder="Order number (GP-1001)" className="h-12 w-full rounded-2xl border px-4" />
        <input name="phone" defaultValue={sp.phone} placeholder="Phone" className="h-12 w-full rounded-2xl border px-4" />
        <button className="h-11 rounded-full bg-cta px-6 font-semibold text-white">Track</button>
      </form>
      {order && (
        <div className="mt-8 rounded-3xl bg-white p-6">
          <p className="font-medium">
            {order.number} · {formatPkr(order.total)}
          </p>
          <ol className="mt-4 space-y-2 text-sm">
            {order.history.map((h) => (
              <li key={h.id}>
                {h.status.replaceAll("_", " ")} — {h.createdAt.toLocaleString()}
              </li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
}
