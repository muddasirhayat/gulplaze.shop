"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function toggleWishlist(productId: string) {
  const session = await getSession();
  if (!session?.user) return { ok: false, login: true };
  const existing = await prisma.wishlistItem.findUnique({
    where: { userId_productId: { userId: session.user.id, productId } },
  });
  if (existing) {
    await prisma.wishlistItem.delete({ where: { id: existing.id } });
  } else {
    await prisma.wishlistItem.create({ data: { userId: session.user.id, productId } });
  }
  revalidatePath("/wishlist");
  return { ok: true };
}

export async function addChild(form: FormData) {
  const session = await getSession();
  if (!session?.user) return;
  await prisma.childProfile.create({
    data: {
      userId: session.user.id,
      name: String(form.get("name")),
      birthday: form.get("birthday") ? new Date(String(form.get("birthday"))) : null,
      gender: String(form.get("gender") || ""),
      ageKey: String(form.get("ageKey") || ""),
    },
  });
  revalidatePath("/account");
}

export async function saveAddress(form: FormData) {
  const session = await getSession();
  if (!session?.user) return;
  await prisma.address.create({
    data: {
      userId: session.user.id,
      fullName: String(form.get("fullName")),
      phone: String(form.get("phone")),
      city: String(form.get("city")),
      area: String(form.get("area")),
      address: String(form.get("address")),
      postalCode: String(form.get("postalCode") || "") || null,
      landmark: String(form.get("landmark") || "") || null,
    },
  });
  revalidatePath("/account");
}

export async function requestReturn(orderId: string, type: string, reason: string) {
  const session = await getSession();
  if (!session?.user) return;
  await prisma.returnRequest.create({ data: { orderId, type, reason } });
  revalidatePath("/account");
}

export async function subscribeBackInStock(productId: string, variantId: string | undefined, email: string) {
  const session = await getSession();
  await prisma.backInStock.create({
    data: { productId, variantId, email, userId: session?.user?.id },
  });
}
