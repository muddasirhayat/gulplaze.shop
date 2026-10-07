import { NextRequest, NextResponse } from "next/server";
import { getStaffSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/utils";
import Papa from "papaparse";

export async function POST(req: NextRequest) {
  const session = await getStaffSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const form = await req.formData();
  const file = form.get("file") as File | null;
  if (!file) return NextResponse.redirect(new URL("/admin/products", req.url));
  const text = await file.text();
  const parsed = Papa.parse<Record<string, string>>(text, { header: true, skipEmptyLines: true });
  for (const row of parsed.data) {
    const title = row.title || row.Title;
    if (!title) continue;
    const slug = row.slug || slugify(title);
    const price = Number(row.price || row["Variant Price"] || 0);
    const product = await prisma.product.upsert({
      where: { slug },
      update: { title, price, description: row.description || row.Body || "" },
      create: {
        title,
        slug,
        price,
        description: row.description || row.Body || "",
        sku: row.sku || row.SKU || null,
        status: "active",
        tags: JSON.stringify((row.tags || "").split(",").filter(Boolean)),
      },
    });
    if (row.image || row["Image Src"]) {
      await prisma.productImage.create({
        data: { productId: product.id, url: row.image || row["Image Src"], alt: title },
      });
    }
    const sku = row.sku || `${slug}-1`;
    const existing = await prisma.productVariant.findUnique({ where: { sku } }).catch(() => null);
    if (!existing) {
      await prisma.productVariant.create({
        data: {
          productId: product.id,
          name: "Default",
          sku,
          stock: Number(row.stock || row["Variant Inventory Qty"] || 10),
        },
      });
    }
    const ages = (row.ages || "").split(",").map((a) => a.trim()).filter(Boolean);
    for (const ageKey of ages) {
      await prisma.productAge.upsert({
        where: { productId_ageKey: { productId: product.id, ageKey } },
        update: {},
        create: { productId: product.id, ageKey },
      });
    }
  }
  return NextResponse.redirect(new URL("/admin/products", req.url));
}
