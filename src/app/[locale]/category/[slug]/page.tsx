import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ProductListing } from "@/components/storefront/product-listing";
import { filtersFromSearch } from "@/lib/catalog";

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const { slug } = await params;
  const sp = await searchParams;
  const category = await prisma.category.findUnique({ where: { slug } });
  if (!category) notFound();
  return (
    <ProductListing
      title={category.name}
      description={category.description || `Shop ${category.name.toLowerCase()} at GulPlaze.`}
      crumbs={[{ href: `/category/${slug}`, label: category.name }]}
      filters={{ ...filtersFromSearch(sp), category: slug }}
    />
  );
}
