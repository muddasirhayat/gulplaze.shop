import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const [products, posts, categories] = await Promise.all([
    prisma.product.findMany({ where: { status: "active" }, select: { slug: true, updatedAt: true } }),
    prisma.blogPost.findMany({ where: { status: "published" }, select: { slug: true, updatedAt: true } }),
    prisma.category.findMany({ select: { slug: true } }),
  ]);
  const staticPaths = ["", "/shop", "/gifts", "/sale", "/about", "/contact", "/faq", "/blog", "/brands"];
  return [
    ...staticPaths.map((p) => ({ url: `${base}${p}`, changeFrequency: "weekly" as const, priority: 0.8 })),
    ...products.map((p) => ({ url: `${base}/product/${p.slug}`, lastModified: p.updatedAt })),
    ...posts.map((p) => ({ url: `${base}/blog/${p.slug}`, lastModified: p.updatedAt })),
    ...categories.map((c) => ({ url: `${base}/category/${c.slug}` })),
  ];
}
