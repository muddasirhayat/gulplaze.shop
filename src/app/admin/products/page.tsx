import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getStaffSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { formatPkr } from "@/lib/money";
import { duplicateProduct } from "@/actions/admin";

export default async function AdminProducts({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const session = await getStaffSession();
  if (!session) redirect("/admin/login");
  const { q } = await searchParams;
  const products = await prisma.product.findMany({
    where: q ? { title: { contains: q } } : undefined,
    include: { variants: true, category: true },
    orderBy: { updatedAt: "desc" },
    take: 80,
  });
  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-serif text-3xl">Products</h1>
        <div className="flex gap-2">
          <Link href="/admin/products/import" className="rounded-full bg-white px-4 py-2 text-sm">
            CSV import
          </Link>
          <a href="/api/admin/export" className="rounded-full bg-white px-4 py-2 text-sm">
            CSV export
          </a>
          <Link href="/admin/products/new" className="rounded-full bg-[#f2836b] px-4 py-2 text-sm font-semibold text-white">
            Add product
          </Link>
        </div>
      </div>
      <form className="mt-4">
        <input name="q" defaultValue={q} placeholder="Search" className="h-11 w-full max-w-sm rounded-full border px-4" />
      </form>
      <div className="mt-6 overflow-x-auto rounded-3xl bg-white">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b">
              <th className="p-3">Title</th>
              <th className="p-3">Status</th>
              <th className="p-3">Price</th>
              <th className="p-3">Stock</th>
              <th className="p-3"></th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="border-b border-black/5">
                <td className="p-3">
                  <Link href={`/admin/products/${p.id}`} className="underline">
                    {p.title}
                  </Link>
                </td>
                <td className="p-3">{p.status}</td>
                <td className="p-3">{formatPkr(p.price)}</td>
                <td className="p-3">{p.variants.reduce((s, v) => s + v.stock, 0)}</td>
                <td className="p-3">
                  <form action={duplicateProduct.bind(null, p.id)}>
                    <button className="text-xs underline">Duplicate</button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
