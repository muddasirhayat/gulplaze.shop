import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export function filtersFromSearch(sp: Record<string, string | undefined>) {
  return {
    q: sp.q,
    age: sp.age,
    gender: sp.gender,
    brand: sp.brand,
    sort: sp.sort,
    inStock: sp.inStock === "1",
    minPrice: sp.min ? Number(sp.min) : undefined,
    maxPrice: sp.max ? Number(sp.max) : undefined,
    sale: sp.sale === "1",
    size: sp.size,
    color: sp.color,
    material: sp.material,
  };
}

export type ProductFilters = {
  q?: string;
  category?: string;
  age?: string;
  gender?: string;
  size?: string;
  color?: string;
  brand?: string;
  material?: string;
  minPrice?: number;
  maxPrice?: number;
  discount?: boolean;
  inStock?: boolean;
  type?: string;
  sale?: boolean;
  sort?: string;
  take?: number;
  skip?: number;
  featured?: boolean;
  bestSeller?: boolean;
  gift?: boolean;
  collection?: string;
};

const include = {
  images: { orderBy: { sortOrder: "asc" as const } },
  variants: true,
  ages: true,
  brand: true,
  category: true,
  reviews: { where: { status: "approved" }, select: { rating: true } },
};

export type CatalogProduct = Prisma.ProductGetPayload<{ include: typeof include }>;

export function avgRating(product: { reviews: { rating: number }[] }) {
  if (!product.reviews.length) return 0;
  return (
    product.reviews.reduce((sum, review) => sum + review.rating, 0) / product.reviews.length
  );
}

export async function getProducts(filters: ProductFilters = {}) {
  const and: Prisma.ProductWhereInput[] = [{ status: "active" }];

  if (filters.q) {
    and.push({
      OR: [
        { title: { contains: filters.q } },
        { description: { contains: filters.q } },
        { tags: { contains: filters.q.toLowerCase() } },
        { sku: { contains: filters.q } },
      ],
    });
  }
  if (filters.category) {
    and.push({
      OR: [
        { category: { slug: filters.category } },
        { category: { parent: { slug: filters.category } } },
      ],
    });
  }

  const where: Prisma.ProductWhereInput = { AND: and };
  if (filters.age) where.ages = { some: { ageKey: filters.age } };
  if (filters.gender && filters.gender !== "unisex") {
    where.OR = [{ gender: filters.gender }, { gender: "unisex" }];
  }
  if (filters.brand) where.brand = { slug: filters.brand };
  if (filters.material) where.material = { contains: filters.material };
  if (filters.type) where.tags = { contains: filters.type };
  if (filters.featured) where.featured = true;
  if (filters.bestSeller) where.bestSeller = true;
  if (filters.gift) where.giftReady = true;
  if (filters.sale) where.compareAt = { gt: 0 };
  if (filters.minPrice || filters.maxPrice) {
    where.price = {
      gte: filters.minPrice,
      lte: filters.maxPrice,
    };
  }
  if (filters.size || filters.color || filters.inStock) {
    where.variants = {
      some: {
        ...(filters.size ? { size: filters.size } : {}),
        ...(filters.color ? { color: filters.color } : {}),
        ...(filters.inStock ? { stock: { gt: 0 } } : {}),
      },
    };
  }
  if (filters.discount) {
    where.compareAt = { gt: 0 };
  }
  if (filters.collection) {
    where.collections = { some: { collection: { slug: filters.collection } } };
  }

  let orderBy: Prisma.ProductOrderByWithRelationInput = { featured: "desc" };
  if (filters.sort === "newest") orderBy = { createdAt: "desc" };
  if (filters.sort === "price-asc") orderBy = { price: "asc" };
  if (filters.sort === "price-desc") orderBy = { price: "desc" };
  if (filters.sort === "best") orderBy = { bestSeller: "desc" };

  const take = filters.take ?? 24;
  const skip = filters.skip ?? 0;

  const [items, total] = await Promise.all([
    prisma.product.findMany({
      where,
      include,
      orderBy,
      take,
      skip,
    }),
    prisma.product.count({ where }),
  ]);

  return { items, total };
}

export async function getProductBySlug(slug: string) {
  return prisma.product.findUnique({
    where: { slug },
    include: {
      ...include,
      reviews: {
        where: { status: "approved" },
        orderBy: { createdAt: "desc" },
        include: { votes: true },
      },
      questions: { include: { answers: true }, orderBy: { createdAt: "desc" } },
    },
  });
}

export async function getCategories() {
  return prisma.category.findMany({
    orderBy: { sortOrder: "asc" },
    include: { children: { orderBy: { sortOrder: "asc" } } },
  });
}

export async function getBrands() {
  return prisma.brand.findMany({ orderBy: { name: "asc" } });
}

export async function relatedProducts(productId: string, categoryId?: string | null) {
  return prisma.product.findMany({
    where: {
      status: "active",
      id: { not: productId },
      ...(categoryId ? { categoryId } : {}),
    },
    include,
    take: 8,
  });
}

export async function searchSuggest(q: string) {
  if (!q.trim()) {
    return prisma.popularSearch.findMany({ orderBy: { count: "desc" }, take: 6 });
  }
  const products = await prisma.product.findMany({
    where: {
      status: "active",
      OR: [{ title: { contains: q } }, { tags: { contains: q.toLowerCase() } }],
    },
    include: { images: { take: 1, orderBy: { sortOrder: "asc" } } },
    take: 6,
  });
  return products;
}

export async function recordSearch(q: string) {
  const query = q.trim().toLowerCase();
  if (query.length < 2) return;
  await prisma.popularSearch.upsert({
    where: { query },
    update: { count: { increment: 1 } },
    create: { query, count: 1 },
  });
}
