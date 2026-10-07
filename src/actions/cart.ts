"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getOrCreateCart } from "@/lib/cart";

export async function addToCart(productId: string, variantId?: string, quantity = 1) {
  const cart = await getOrCreateCart();
  const existing = await prisma.cartItem.findFirst({
    where: { cartId: cart.id, productId, variantId: variantId ?? null },
  });
  if (existing) {
    await prisma.cartItem.update({
      where: { id: existing.id },
      data: { quantity: existing.quantity + quantity },
    });
  } else {
    await prisma.cartItem.create({
      data: { cartId: cart.id, productId, variantId, quantity },
    });
  }
  revalidatePath("/");
  return { ok: true };
}

export async function updateCartItem(itemId: string, quantity: number) {
  if (quantity <= 0) {
    await prisma.cartItem.delete({ where: { id: itemId } });
  } else {
    await prisma.cartItem.update({ where: { id: itemId }, data: { quantity } });
  }
  revalidatePath("/");
}

export async function removeCartItem(itemId: string) {
  await prisma.cartItem.delete({ where: { id: itemId } });
  revalidatePath("/");
}

export async function applyCoupon(code: string) {
  const coupon = await prisma.coupon.findFirst({
    where: { code: code.trim().toUpperCase(), active: true },
  });
  const cart = await getOrCreateCart();
  if (!coupon) return { ok: false, message: "That code is not valid." };
  await prisma.cart.update({
    where: { id: cart.id },
    data: { couponCode: coupon.code },
  });
  revalidatePath("/");
  return { ok: true, message: "Coupon applied." };
}

export async function setCartMeta(data: { giftWrap?: boolean; giftMessage?: string; note?: string }) {
  const cart = await getOrCreateCart();
  await prisma.cart.update({ where: { id: cart.id }, data });
  revalidatePath("/");
}
