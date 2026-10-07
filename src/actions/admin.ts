"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getStaffSession } from "@/lib/auth";
import { slugify } from "@/lib/utils";
import { bookShipment, type CourierId } from "@/lib/couriers";
import { setSetting } from "@/lib/settings";

async function staff() {
  const s = await getStaffSession();
  if (!s) throw new Error("Unauthorized");
  return s;
}

export async function saveProduct(form: FormData) {
  await staff();
  const id = String(form.get("id") || "");
  const title = String(form.get("title"));
  const data = {
    title,
    slug: String(form.get("slug") || slugify(title)),
    description: String(form.get("description") || ""),
    price: Number(form.get("price") || 0),
    compareAt: form.get("compareAt") ? Number(form.get("compareAt")) : null,
    costPrice: form.get("costPrice") ? Number(form.get("costPrice")) : null,
    sku: String(form.get("sku") || "") || null,
    material: String(form.get("material") || ""),
    care: String(form.get("care") || ""),
    safety: String(form.get("safety") || ""),
    status: String(form.get("status") || "draft"),
    gender: String(form.get("gender") || "unisex"),
    tags: JSON.stringify(
      String(form.get("tags") || "")
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
    ),
    metaTitle: String(form.get("metaTitle") || ""),
    metaDescription: String(form.get("metaDescription") || ""),
    giftReady: form.get("giftReady") === "on",
    featured: form.get("featured") === "on",
    bestSeller: form.get("bestSeller") === "on",
    categoryId: String(form.get("categoryId") || "") || null,
    brandId: String(form.get("brandId") || "") || null,
    publishedAt: String(form.get("status")) === "active" ? new Date() : null,
  };
  const ages = String(form.get("ages") || "")
    .split(",")
    .map((a) => a.trim())
    .filter(Boolean);
  const imageUrl = String(form.get("imageUrl") || "");

  const product = id
    ? await prisma.product.update({ where: { id }, data })
    : await prisma.product.create({ data });

  await prisma.productAge.deleteMany({ where: { productId: product.id } });
  if (ages.length) {
    await prisma.productAge.createMany({ data: ages.map((ageKey) => ({ productId: product.id, ageKey })) });
  }
  if (imageUrl) {
    const existing = await prisma.productImage.count({ where: { productId: product.id } });
    if (!existing) {
      await prisma.productImage.create({ data: { productId: product.id, url: imageUrl, alt: title } });
    }
  }
  const variantSku = String(form.get("variantSku") || `${data.sku || "GP"}-1`);
  const stock = Number(form.get("stock") || 0);
  const size = String(form.get("size") || "");
  const color = String(form.get("color") || "");
  const existingVar = await prisma.productVariant.findFirst({ where: { productId: product.id } });
  if (existingVar) {
    await prisma.productVariant.update({
      where: { id: existingVar.id },
      data: { stock, size, color, sku: existingVar.sku },
    });
  } else {
    await prisma.productVariant.create({
      data: { productId: product.id, name: [color, size].filter(Boolean).join(" / ") || "Default", sku: variantSku, stock, size, color },
    });
  }
  await prisma.activityLog.create({
    data: { actor: "staff", action: id ? "update_product" : "create_product", target: product.id },
  });
  revalidatePath("/admin/products");
  redirect("/admin/products");
}

export async function duplicateProduct(id: string) {
  await staff();
  const p = await prisma.product.findUnique({
    where: { id },
    include: { images: true, variants: true, ages: true },
  });
  if (!p) return;
  const copy = await prisma.product.create({
    data: {
      title: `${p.title} (copy)`,
      slug: `${p.slug}-copy-${Date.now().toString(36)}`,
      description: p.description,
      price: p.price,
      compareAt: p.compareAt,
      costPrice: p.costPrice,
      status: "draft",
      gender: p.gender,
      material: p.material,
      care: p.care,
      safety: p.safety,
      tags: p.tags,
      categoryId: p.categoryId,
      brandId: p.brandId,
      images: { create: p.images.map((i) => ({ url: i.url, alt: i.alt, sortOrder: i.sortOrder })) },
      ages: { create: p.ages.map((a) => ({ ageKey: a.ageKey })) },
      variants: {
        create: p.variants.map((v) => ({
          name: v.name,
          sku: `${v.sku}-C`,
          size: v.size,
          color: v.color,
          colorHex: v.colorHex,
          stock: v.stock,
          price: v.price,
        })),
      },
    },
  });
  revalidatePath("/admin/products");
  redirect(`/admin/products/${copy.id}`);
}

export async function updateOrderStatus(id: string, status: string) {
  await staff();
  await prisma.order.update({ where: { id }, data: { status } });
  await prisma.orderStatusHistory.create({ data: { orderId: id, status } });
  revalidatePath("/admin/orders");
}

export async function bookCourier(orderId: string, courier: CourierId) {
  await staff();
  const order = await prisma.order.findUnique({ where: { id: orderId } });
  if (!order) return;
  const booking = await bookShipment(courier, order.number, order.city);
  await prisma.order.update({
    where: { id: orderId },
    data: { courier, trackingNumber: booking.trackingNumber, status: "shipped" },
  });
  await prisma.shipment.create({
    data: {
      orderId,
      courier,
      trackingNumber: booking.trackingNumber,
      status: "booked",
      bookedAt: new Date(),
    },
  });
  revalidatePath(`/admin/orders/${orderId}`);
}

export async function savePage(form: FormData) {
  await staff();
  const id = String(form.get("id") || "");
  const title = String(form.get("title"));
  const slug = String(form.get("slug") || slugify(title));
  const body = String(form.get("body") || "");
  const page = id
    ? await prisma.page.update({ where: { id }, data: { title, slug, body } })
    : await prisma.page.create({ data: { title, slug, body } });
  await prisma.pageRevision.create({ data: { pageId: page.id, body } });
  revalidatePath("/admin/pages");
  redirect("/admin/pages");
}

export async function savePost(form: FormData) {
  await staff();
  const id = String(form.get("id") || "");
  const title = String(form.get("title"));
  const data = {
    title,
    slug: String(form.get("slug") || slugify(title)),
    excerpt: String(form.get("excerpt") || ""),
    body: String(form.get("body") || ""),
    cover: String(form.get("cover") || ""),
    status: String(form.get("status") || "draft"),
    publishedAt: String(form.get("status")) === "published" ? new Date() : null,
  };
  if (id) await prisma.blogPost.update({ where: { id }, data });
  else await prisma.blogPost.create({ data });
  revalidatePath("/admin/blog");
  redirect("/admin/blog");
}

export async function saveHomepageOrder(ids: string[]) {
  await staff();
  await Promise.all(ids.map((id, i) => prisma.homepageSection.update({ where: { id }, data: { sortOrder: i } })));
  revalidatePath("/admin/homepage");
}

export async function toggleSection(id: string, visible: boolean) {
  await staff();
  await prisma.homepageSection.update({ where: { id }, data: { visible } });
  revalidatePath("/admin/homepage");
}

export async function saveMenu(handle: string, items: string) {
  await staff();
  await prisma.menu.upsert({
    where: { handle },
    update: { items },
    create: { handle, items },
  });
  revalidatePath("/admin/menus");
}

export async function saveCoupon(form: FormData) {
  await staff();
  await prisma.coupon.create({
    data: {
      code: String(form.get("code")).toUpperCase(),
      type: String(form.get("type")),
      value: Number(form.get("value") || 0),
      minSpend: Number(form.get("minSpend") || 0),
      firstOrderOnly: form.get("firstOrderOnly") === "on",
    },
  });
  revalidatePath("/admin/discounts");
}

export async function moderateReview(id: string, status: string) {
  await staff();
  await prisma.review.update({ where: { id }, data: { status } });
  revalidatePath("/admin/reviews");
}

export async function saveTheme(form: FormData) {
  await staff();
  await setSetting("theme", {
    logoText: String(form.get("logoText") || "gulplaze"),
    background: String(form.get("background") || "#FFF9F3"),
    primary: String(form.get("primary") || "#A8C3A0"),
    cta: String(form.get("cta") || "#F2836B"),
    radius: String(form.get("radius") || "18px"),
  });
  revalidatePath("/admin/settings");
}

export async function saveStoreInfo(form: FormData) {
  await staff();
  const current = await prisma.setting.findUnique({ where: { key: "storeInfo" } });
  const prev = current ? JSON.parse(current.value) : {};
  await setSetting("storeInfo", {
    ...prev,
    name: String(form.get("name") || "GulPlaze"),
    email: String(form.get("email")),
    phone: String(form.get("phone")),
    whatsapp: String(form.get("whatsapp")),
    address: String(form.get("address")),
    freeShippingThreshold: Number(form.get("freeShippingThreshold") || 3000),
    giftWrapPrice: Number(form.get("giftWrapPrice") || 200),
  });
  revalidatePath("/admin/settings");
}

export async function addRedirect(form: FormData) {
  await staff();
  await prisma.redirect.create({
    data: { from: String(form.get("from")), to: String(form.get("to")) },
  });
  revalidatePath("/admin/settings");
}
