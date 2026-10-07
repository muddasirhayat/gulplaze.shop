import { NextResponse } from "next/server";
import { getStaffSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Papa from "papaparse";

export async function GET() {
  const session = await getStaffSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const products = await prisma.product.findMany({ include: { variants: true, ages: true, images: true, category: true, brand: true } });
  const rows = products.map((p) => ({
    title: p.title,
    slug: p.slug,
    sku: p.sku,
    price: p.price,
    compareAt: p.compareAt,
    description: p.description,
    category: p.category?.slug,
    brand: p.brand?.name,
    ages: p.ages.map((a) => a.ageKey).join(","),
    stock: p.variants.reduce((s, v) => s + v.stock, 0),
    image: p.images[0]?.url,
    tags: p.tags,
  }));
  const csv = Papa.unparse(rows);
  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": "attachment; filename=gulplaze-products.csv",
    },
  });
}
