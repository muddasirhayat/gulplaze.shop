import { prisma } from "@/lib/prisma";
import { formatPkr } from "@/lib/money";
import { notFound } from "next/navigation";
import { trackingUrl, type CourierId } from "@/lib/couriers";

export default async function ThankYouPage({
  params,
  searchParams,
}: {
  params: Promise<{ number: string }>;
  searchParams: Promise<{ phone?: string }>;
}) {
  const { number } = await params;
  const sp = await searchParams;
  const order = await prisma.order.findFirst({
    where: { number, ...(sp.phone ? { phone: sp.phone } : {}) },
    include: { items: true, shipments: true },
  });
  if (!order) notFound();
  return (
    <div className="container-gp max-w-2xl py-16">
      <p className="text-sm uppercase tracking-widest text-primary">Thank you</p>
      <h1 className="mt-2 font-serif text-4xl">Order {order.number}</h1>
      <p className="mt-3 text-muted">
        We have sent a note by SMS and WhatsApp. Status: {order.status.replaceAll("_", " ")}.
      </p>
      <ul className="mt-8 space-y-3">
        {order.items.map((item) => (
          <li key={item.id} className="flex justify-between text-sm">
            <span>
              {item.title} × {item.quantity}
            </span>
            <span>{formatPkr(item.price * item.quantity)}</span>
          </li>
        ))}
      </ul>
      <p className="mt-4 flex justify-between font-semibold">
        <span>Total</span>
        <span>{formatPkr(order.total)}</span>
      </p>
      {order.trackingNumber && (
        <p className="mt-4 text-sm">
          Tracking:{" "}
          <a className="underline" href={trackingUrl((order.courier as CourierId) || "mock", order.trackingNumber)}>
            {order.trackingNumber}
          </a>
        </p>
      )}
    </div>
  );
}
