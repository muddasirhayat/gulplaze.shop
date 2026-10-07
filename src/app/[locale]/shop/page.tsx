import { ProductListing } from "@/components/storefront/product-listing";
import { filtersFromSearch } from "@/lib/catalog";

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const sp = await searchParams;
  return (
    <ProductListing
      title="Shop all"
      description="Clothes, toys and mother care, gathered in one calm place."
      crumbs={[{ href: "/shop", label: "Shop all" }]}
      filters={filtersFromSearch(sp)}
    />
  );
}
