import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendNotice } from "@/lib/notify";

export async function GET() {
  const cutoff = new Date(Date.now() - 2 * 60 * 60 * 1000);
  const carts = await prisma.cart.findMany({
    where: {
      recovered: false,
      recoverySentAt: null,
      updatedAt: { lt: cutoff },
      items: { some: {} },
    },
    include: { user: true, items: true },
    take: 20,
  });
  for (const cart of carts) {
    const to = cart.email || cart.phone || cart.user?.email || cart.user?.phone;
    if (to) {
      await sendNotice("whatsapp", to, "Your basket", "You left something soft in your GulPlaze basket.");
      await sendNotice("email", to, "Your GulPlaze basket", "Your pieces are still waiting.");
    }
    await prisma.cart.update({ where: { id: cart.id }, data: { recoverySentAt: new Date() } });
  }
  return NextResponse.json({ sent: carts.length });
}
