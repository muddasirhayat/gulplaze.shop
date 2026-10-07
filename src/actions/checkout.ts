"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getOrCreateCart, cartTotals } from "@/lib/cart";
import { getStoreInfo } from "@/lib/settings";
import { getShippingRate } from "@/lib/shipping";
import { sendOtp, sendOrderConfirmation } from "@/lib/notify";
import { createGatewaySession, type PaymentMethod } from "@/lib/payments";
import { formatPkr } from "@/lib/money";
import { getSession } from "@/lib/auth";
import { LOYALTY_EARN_PER_100 } from "@/lib/constants";

export async function sendCodOtp(phone: string) {
  const code = String(Math.floor(100000 + Math.random() * 900000));
  await prisma.otpCode.create({
    data: {
      phone,
      code,
      expiresAt: new Date(Date.now() + 10 * 60_000),
    },
  });
  await sendOtp(phone, code);
  return { ok: true, devCode: process.env.NODE_ENV === "development" ? code : undefined };
}

export async function verifyOtp(phone: string, code: string) {
  const row = await prisma.otpCode.findFirst({
    where: { phone, code, consumed: false, expiresAt: { gt: new Date() } },
    orderBy: { expiresAt: "desc" },
  });
  if (!row) return { ok: false };
  await prisma.otpCode.update({ where: { id: row.id }, data: { consumed: true } });
  return { ok: true };
}

export async function placeOrder(form: FormData) {
  const session = await getSession();
  const cart = await getOrCreateCart();
  if (!cart.items.length) return { ok: false, message: "Your basket is empty." };

  const phone = String(form.get("phone") || "");
  const blocked = await prisma.blockedCustomer.findUnique({ where: { phone } });
  if (blocked) return { ok: false, message: "We cannot take this order. Please contact us." };

  const paymentMethod = String(form.get("paymentMethod") || "cod") as PaymentMethod;
  if (paymentMethod === "cod") {
    const otp = String(form.get("otp") || "");
    const verified = await verifyOtp(phone, otp);
    if (!verified.ok) return { ok: false, message: "Please verify the code sent to your phone." };
  }

  let couponValue = 0;
  if (cart.couponCode) {
    const coupon = await prisma.coupon.findUnique({ where: { code: cart.couponCode } });
    const subtotal = cart.items.reduce(
      (s, i) => s + (i.variant?.price ?? i.product.price) * i.quantity,
      0,
    );
    if (coupon?.active && subtotal >= coupon.minSpend) {
      couponValue = coupon.type === "percent" ? Math.round((subtotal * coupon.value) / 100) : coupon.value;
      if (coupon.type === "free_shipping") couponValue = 0;
      await prisma.coupon.update({ where: { id: coupon.id }, data: { usedCount: { increment: 1 } } });
    }
  }

  const info = await getStoreInfo();
  const totals = cartTotals(cart, couponValue, info.giftWrapPrice);
  const weight = cart.items.reduce((s, i) => {
    const grams = "weightGrams" in i.product ? Number((i.product as { weightGrams?: number }).weightGrams) || 400 : 400;
    return s + grams * i.quantity;
  }, 0);
  const city = String(form.get("city"));
  let shipping = await getShippingRate(city, weight, totals.subtotal);
  if (cart.couponCode) {
    const coupon = await prisma.coupon.findUnique({ where: { code: cart.couponCode } });
    if (coupon?.type === "free_shipping") shipping = 0;
  }

  const giftCardCode = String(form.get("giftCard") || "");
  let storeCreditUsed = 0;
  if (giftCardCode) {
    const card = await prisma.giftCard.findUnique({ where: { code: giftCardCode } });
    if (card && card.active && card.balance > 0) {
      storeCreditUsed = Math.min(card.balance, totals.total + shipping);
      await prisma.giftCard.update({
        where: { id: card.id },
        data: { balance: card.balance - storeCreditUsed },
      });
    }
  }

  const loyaltyRedeem = Number(form.get("loyalty") || 0);
  const user = session?.user
    ? await prisma.user.findUnique({ where: { id: session.user.id } })
    : null;
  const loyaltyUsed = Math.min(loyaltyRedeem, user?.loyaltyPoints ?? 0, totals.total);

  const total = Math.max(0, totals.total + shipping - storeCreditUsed - loyaltyUsed);
  const count = await prisma.order.count();
  const number = `GP-${1001 + count}`;

  const receipt = form.get("receipt") as File | null;
  let receiptUrl: string | undefined;
  if (receipt && receipt.size > 0) {
    const bytes = Buffer.from(await receipt.arrayBuffer());
    const fs = await import("fs/promises");
    const path = await import("path");
    const name = `receipt-${number}-${receipt.name}`;
    await fs.mkdir(path.join(process.cwd(), "public/uploads"), { recursive: true });
    await fs.writeFile(path.join(process.cwd(), "public/uploads", name), bytes);
    receiptUrl = `/uploads/${name}`;
  }

  const order = await prisma.order.create({
    data: {
      number,
      userId: session?.user?.id,
      email: String(form.get("email") || "") || null,
      phone,
      fullName: String(form.get("fullName")),
      city,
      area: String(form.get("area")),
      address: String(form.get("address")),
      postalCode: String(form.get("postal") || "") || null,
      landmark: String(form.get("landmark") || "") || null,
      paymentMethod,
      paymentStatus: paymentMethod === "cod" ? "pending" : receiptUrl ? "pending" : "pending",
      subtotal: totals.subtotal,
      shipping,
      discount: totals.discount,
      giftWrap: totals.wrap,
      loyaltyRedeemed: loyaltyUsed,
      storeCreditUsed,
      total,
      couponCode: cart.couponCode,
      giftMessage: cart.giftMessage,
      note: cart.note,
      otpVerified: paymentMethod === "cod",
      status: "pending_confirmation",
      items: {
        create: cart.items.map((item) => ({
          productId: item.productId,
          variantId: item.variantId,
          title: item.product.title,
          variantName: item.variant?.name ?? "",
          image: item.product.images[0]?.url ?? "",
          price: item.variant?.price ?? item.product.price,
          quantity: item.quantity,
          costPrice: 0,
        })),
      },
      payments: {
        create: {
          method: paymentMethod,
          amount: total,
          status: "pending",
          receiptUrl,
        },
      },
      history: { create: { status: "pending_confirmation", note: "Order placed" } },
    },
  });

  for (const item of cart.items) {
    if (item.variantId) {
      await prisma.productVariant.update({
        where: { id: item.variantId },
        data: { stock: { decrement: item.quantity } },
      });
    }
  }

  if (user && loyaltyUsed) {
    await prisma.user.update({
      where: { id: user.id },
      data: { loyaltyPoints: { decrement: loyaltyUsed } },
    });
    await prisma.loyaltyLedger.create({
      data: { userId: user.id, points: -loyaltyUsed, reason: `Redeemed on ${number}` },
    });
  }
  if (user) {
    const points = Math.floor(total / 100) * LOYALTY_EARN_PER_100;
    if (points) {
      await prisma.user.update({
        where: { id: user.id },
        data: { loyaltyPoints: { increment: points } },
      });
      await prisma.loyaltyLedger.create({
        data: { userId: user.id, points, reason: `Earned on ${number}` },
      });
    }
  }

  await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
  await prisma.cart.update({
    where: { id: cart.id },
    data: { couponCode: null, giftWrap: false, giftMessage: "", note: "" },
  });
  const jar = await cookies();
  jar.delete("gp_cart");

  await sendOrderConfirmation(phone, number, formatPkr(total));
  await prisma.notificationInbox.create({
    data: {
      type: "order",
      title: `New order ${number}`,
      body: `${order.fullName} · ${formatPkr(total)} · ${paymentMethod}`,
    },
  });

  const pay = await createGatewaySession(paymentMethod, order.id, total);
  if (pay.redirectUrl) {
    redirect(pay.redirectUrl);
  }
  redirect(`/order/${number}?phone=${encodeURIComponent(phone)}`);
}
