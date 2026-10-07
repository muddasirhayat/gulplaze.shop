import { ProductListing } from "@/components/storefront/product-listing";
import { filtersFromSearch } from "@/lib/catalog";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const sp = await searchParams;
  const q = sp.q ?? "";
  return (
    <ProductListing
      title={q ? `Results for “${q}”` : "Search"}
      crumbs={[{ href: "/search", label: "Search" }]}
      filters={{ ...filtersFromSearch(sp), q }}
    />
  );
}
