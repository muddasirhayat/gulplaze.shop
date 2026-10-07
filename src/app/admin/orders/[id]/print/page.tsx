import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { formatPkr } from "@/lib/money";

export default async function PrintOrder({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const order = await prisma.order.findUnique({ where: { id }, include: { items: true } });
  if (!order) notFound();
  return (
    <div className="mx-auto max-w-xl bg-white p-8 print:p-0">
      <h1 className="font-serif text-2xl">GulPlaze</h1>
      <p>Invoice {order.number}</p>
      <p className="mt-4 text-sm">
        {order.fullName}
        <br />
        {order.address}, {order.area}, {order.city}
        <br />
        {order.phone}
      </p>
      <table className="mt-6 w-full text-sm">
        <tbody>
          {order.items.map((i) => (
            <tr key={i.id} className="border-t">
              <td className="py-2">
                {i.title} × {i.quantity}
              </td>
              <td className="py-2 text-right">{formatPkr(i.price * i.quantity)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="mt-4 text-right font-semibold">Total {formatPkr(order.total)}</p>
      <p className="mt-8 text-xs">Thank you · Where little ones bloom</p>
    </div>
  );
}
