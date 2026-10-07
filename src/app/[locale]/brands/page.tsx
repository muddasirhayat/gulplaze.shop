import { prisma } from "@/lib/prisma";
import { Link } from "@/i18n/navigation";

export default async function BrandsPage() {
  const brands = await prisma.brand.findMany({ include: { _count: { select: { products: true } } } });
  return (
    <div className="container-gp py-12">
      <h1 className="font-serif text-4xl">Brands</h1>
      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {brands.map((b) => (
          <Link key={b.id} href={`/shop?brand=${b.slug}`} className="rounded-3xl bg-white p-6 card-shadow">
            <h2 className="font-serif text-2xl">{b.name}</h2>
            <p className="text-sm text-muted">{b._count.products} pieces</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
