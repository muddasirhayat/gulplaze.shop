import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { recordSearch } from "@/lib/catalog";

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q")?.trim() ?? "";
  const popular = await prisma.popularSearch.findMany({ orderBy: { count: "desc" }, take: 6 });
  if (q.length < 2) {
    return NextResponse.json({ products: [], popular: popular.map((p) => p.query) });
  }
  await recordSearch(q);
  const products = await prisma.product.findMany({
    where: {
      status: "active",
      OR: [{ title: { contains: q } }, { tags: { contains: q.toLowerCase() } }, { sku: { contains: q } }],
    },
    include: { images: { take: 1, orderBy: { sortOrder: "asc" } } },
    take: 6,
  });
  return NextResponse.json({
    popular: popular.map((p) => p.query),
    products: products.map((p) => ({
      slug: p.slug,
      title: p.title,
      price: p.price,
      image: p.images[0]?.url,
    })),
  });
}
