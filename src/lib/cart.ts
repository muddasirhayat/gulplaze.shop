import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { getStoreInfo } from "@/lib/settings";
import { getSession } from "@/lib/auth";

const COOKIE = "gp_cart";

export async function getCartId() {
  const jar = await cookies();
  return jar.get(COOKIE)?.value ?? null;
}

export async function getOrCreateCart() {
  const jar = await cookies();
  let id = jar.get(COOKIE)?.value;
  const session = await getSession();
  if (id) {
    const existing = await prisma.cart.findUnique({
      where: { id },
      include: cartInclude,
    });
    if (existing) {
      if (session?.user && !existing.userId) {
        await prisma.cart.update({
          where: { id },
          data: { userId: session.user.id },
        });
      }
      return prisma.cart.findUniqueOrThrow({ where: { id }, include: cartInclude });
    }
  }
  if (session?.user) {
    const userCart = await prisma.cart.findFirst({
      where: { userId: session.user.id },
      include: cartInclude,
      orderBy: { updatedAt: "desc" },
    });
    if (userCart) {
      jar.set(COOKIE, userCart.id, { path: "/", httpOnly: true, maxAge: 60 * 60 * 24 * 30 });
      return userCart;
    }
  }
  const cart = await prisma.cart.create({
    data: { userId: session?.user?.id },
    include: cartInclude,
  });
  jar.set(COOKIE, cart.id, { path: "/", httpOnly: true, maxAge: 60 * 60 * 24 * 30 });
  return cart;
}

const cartInclude = {
  items: {
    include: {
      product: { include: { images: { take: 1, orderBy: { sortOrder: "asc" as const } } } },
      variant: true,
    },
  },
};

export async function getCart() {
  const id = await getCartId();
  if (!id) return null;
  return prisma.cart.findUnique({ where: { id }, include: cartInclude });
}

export function cartTotals(
  cart: {
    items: {
      quantity: number;
      product: { price: number };
      variant: { price: number | null } | null;
    }[];
    giftWrap: boolean;
    couponCode: string | null;
  },
  couponValue = 0,
  giftWrapPrice = 200,
) {
  const subtotal = cart.items.reduce((sum, item) => {
    const unit = item.variant?.price ?? item.product.price;
    return sum + unit * item.quantity;
  }, 0);
  const wrap = cart.giftWrap ? giftWrapPrice : 0;
  const discount = couponValue;
  return { subtotal, wrap, discount, total: Math.max(0, subtotal + wrap - discount) };
}

export async function cartCount() {
  const cart = await getCart();
  if (!cart) return 0;
  return cart.items.reduce((sum, item) => sum + item.quantity, 0);
}

export async function getGiftWrapPrice() {
  const info = await getStoreInfo();
  return info.giftWrapPrice;
}
