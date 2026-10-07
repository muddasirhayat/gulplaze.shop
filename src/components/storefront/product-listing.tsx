import { createT } from "@/lib/i18n-server";
import { Link } from "@/i18n/navigation";
import { getBrands, getProducts, type ProductFilters } from "@/lib/catalog";
import { AGE_RANGES } from "@/lib/constants";
import { ProductCard } from "@/components/storefront/product-card";
import { FilterBar } from "@/components/storefront/filter-bar";

export async function ProductListing({
  title,
  description,
  filters,
  crumbs,
}: {
  title: string;
  description?: string;
  filters: ProductFilters;
  crumbs: { href: string; label: string }[];
}) {
  const t = await createT("filters");
  const [{ items, total }, brands] = await Promise.all([
    getProducts({ ...filters, take: filters.take ?? 24 }),
    getBrands(),
  ]);

  return (
    <div className="container-gp py-10">
      <nav className="text-sm text-muted">
        <Link href="/">Home</Link>
        {crumbs.map((c) => (
          <span key={c.href}>
            {" / "}
            <Link href={c.href}>{c.label}</Link>
          </span>
        ))}
      </nav>
      <h1 className="mt-4 font-serif text-4xl">{title}</h1>
      {description ? <p className="mt-2 max-w-2xl text-muted">{description}</p> : null}
      <p className="mt-2 text-sm text-muted">{total} pieces</p>
      <div className="mt-8 grid gap-8 lg:grid-cols-[240px_1fr]">
        <FilterBar brands={brands.map((b) => ({ slug: b.slug, name: b.name }))} />
        <div>
          {!items.length ? (
            <div className="rounded-3xl bg-white p-10 text-center">
              <p>{t("empty")}</p>
              <div className="mt-4 flex flex-wrap justify-center gap-2">
                {AGE_RANGES.slice(0, 4).map((a) => (
                  <Link key={a.key} href={`/age/${a.key}`} className="rounded-full bg-background px-4 py-2">
                    {a.label}
                  </Link>
                ))}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
              {items.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
