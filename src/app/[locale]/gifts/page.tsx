import { Link } from "@/i18n/navigation";
import { ProductListing } from "@/components/storefront/product-listing";
import { filtersFromSearch } from "@/lib/catalog";
import { GiftFinder } from "@/components/storefront/gift-finder";

export default async function GiftsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const sp = await searchParams;
  return (
    <>
      <div className="container-gp pt-10">
        <h1 className="font-serif text-4xl">Gift shop</h1>
        <p className="mt-2 max-w-xl text-muted">Hampers, boxes and wrap for newborns, birthdays and Eid.</p>
        <div className="mt-6 flex flex-wrap gap-3">
          {[
            ["Under Rs. 1,500", "/gifts?max=1500"],
            ["Under Rs. 3,000", "/gifts?max=3000"],
            ["Under Rs. 5,000", "/gifts?max=5000"],
            ["Premium", "/gifts?min=5000"],
          ].map(([label, href]) => (
            <Link key={label} href={href} className="rounded-full bg-white px-4 py-2 text-sm card-shadow">
              {label}
            </Link>
          ))}
          <Link href="/gifts/finder" className="rounded-full bg-cta px-4 py-2 text-sm text-white">
            Gift finder
          </Link>
        </div>
        <GiftFinder />
      </div>
      <ProductListing
        title="Gift ready"
        crumbs={[{ href: "/gifts", label: "Gifts" }]}
        filters={{ ...filtersFromSearch(sp), gift: true }}
      />
    </>
  );
}
