import { notFound } from "next/navigation";
import { AGE_RANGES } from "@/lib/constants";
import { ProductListing } from "@/components/storefront/product-listing";
import { filtersFromSearch } from "@/lib/catalog";

export default async function AgePage({
  params,
  searchParams,
}: {
  params: Promise<{ key: string }>;
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const { key } = await params;
  const sp = await searchParams;
  const age = AGE_RANGES.find((a) => a.key === key);
  if (!age) notFound();
  return (
    <ProductListing
      title={age.label}
      description="Pieces chosen for this age — clothing, play and care."
      crumbs={[{ href: `/age/${key}`, label: age.label }]}
      filters={{ ...filtersFromSearch(sp), age: key }}
    />
  );
}
