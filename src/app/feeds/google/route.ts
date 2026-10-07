import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const products = await prisma.product.findMany({
    where: { status: "active" },
    include: { images: { take: 1 }, brand: true },
  });
  const header = ["id", "title", "description", "link", "image_link", "price", "availability", "brand"].join("\t");
  const base = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const rows = products.map((p) =>
    [
      p.sku || p.id,
      p.title,
      p.description.replace(/\s+/g, " ").slice(0, 5000),
      `${base}/product/${p.slug}`,
      p.images[0]?.url ?? "",
      `${p.price} PKR`,
      "in stock",
      p.brand?.name ?? "GulPlaze",
    ].join("\t"),
  );
  return new NextResponse([header, ...rows].join("\n"), {
    headers: { "Content-Type": "text/tab-separated-values; charset=utf-8" },
  });
}
