import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export default async function MockPay({
  searchParams,
}: {
  searchParams: Promise<{ order?: string; method?: string }>;
}) {
  const sp = await searchParams;
  async function confirm() {
    "use server";
    if (!sp.order) return;
    const order = await prisma.order.update({
      where: { id: sp.order },
      data: { paymentStatus: "paid", status: "confirmed" },
    });
    await prisma.payment.updateMany({ where: { orderId: order.id }, data: { status: "paid" } });
    redirect(`/order/${order.number}?phone=${encodeURIComponent(order.phone)}`);
  }
  return (
    <div className="container-gp max-w-md py-20 text-center">
      <h1 className="font-serif text-3xl">Sandbox payment</h1>
      <p className="mt-2 text-muted">{sp.method} — confirm to simulate a successful payment.</p>
      <form action={confirm} className="mt-6">
        <button className="h-11 rounded-full bg-cta px-6 font-semibold text-white">Pay now</button>
      </form>
    </div>
  );
}
