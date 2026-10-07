import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { formatPkr } from "@/lib/money";

export default async function InvoicePage({ params }: { params: Promise<{ number: string }> }) {
  const session = await getSession();
  const { number } = await params;
  const order = await prisma.order.findFirst({
    where: { number, ...(session?.user ? { userId: session.user.id } : {}) },
    include: { items: true },
  });
  if (!order) notFound();
  return (
    <div className="container-gp max-w-xl py-12">
      <h1 className="font-serif text-3xl">Invoice {order.number}</h1>
      <p className="mt-2 text-sm">
        {order.fullName}
        <br />
        {order.address}, {order.city}
      </p>
      <ul className="mt-6 space-y-2 text-sm">
        {order.items.map((i) => (
          <li key={i.id} className="flex justify-between">
            <span>
              {i.title} × {i.quantity}
            </span>
            <span>{formatPkr(i.price * i.quantity)}</span>
          </li>
        ))}
      </ul>
      <p className="mt-4 font-semibold">Total {formatPkr(order.total)}</p>
    </div>
  );
}
