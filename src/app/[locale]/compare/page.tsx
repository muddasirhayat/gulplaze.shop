import { prisma } from "@/lib/prisma";
import { formatPkr } from "@/lib/money";

export default async function ComparePage({
  searchParams,
}: {
  searchParams: Promise<{ ids?: string }>;
}) {
  const { ids } = await searchParams;
  const list = (ids || "").split(",").filter(Boolean);
  const products = await prisma.product.findMany({
    where: { id: { in: list } },
    include: { images: { take: 1 }, variants: true, ages: true },
  });
  return (
    <div className="container-gp overflow-x-auto py-12">
      <h1 className="font-serif text-4xl">Compare gear</h1>
      <table className="mt-8 min-w-[640px] w-full text-sm">
        <thead>
          <tr>
            <th className="p-3 text-left"> </th>
            {products.map((p) => (
              <th key={p.id} className="p-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.images[0]?.url} alt="" className="mx-auto h-32 w-24 rounded-2xl object-cover" />
                {p.title}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr className="border-t">
            <td className="p-3">Price</td>
            {products.map((p) => (
              <td key={p.id} className="p-3 text-center">
                {formatPkr(p.price)}
              </td>
            ))}
          </tr>
          <tr className="border-t">
            <td className="p-3">Weight</td>
            {products.map((p) => (
              <td key={p.id} className="p-3 text-center">
                {p.weightGrams} g
              </td>
            ))}
          </tr>
          <tr className="border-t">
            <td className="p-3">Age</td>
            {products.map((p) => (
              <td key={p.id} className="p-3 text-center">
                {p.ages.map((a) => a.ageKey).join(", ")}
              </td>
            ))}
          </tr>
          <tr className="border-t">
            <td className="p-3">Safety</td>
            {products.map((p) => (
              <td key={p.id} className="p-3 text-center">
                {p.safety.slice(0, 120)}
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
}
