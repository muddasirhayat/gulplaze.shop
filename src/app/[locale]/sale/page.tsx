import { ProductListing } from "@/components/storefront/product-listing";
import { filtersFromSearch } from "@/lib/catalog";

export default async function SalePage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const sp = await searchParams;
  return (
    <ProductListing
      title="Sale"
      description="Gentle prices on pieces we still love."
      crumbs={[{ href: "/sale", label: "Sale" }]}
      filters={{ ...filtersFromSearch(sp), sale: true, discount: true }}
    />
  );
}
