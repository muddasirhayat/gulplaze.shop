import { prisma } from "@/lib/prisma";
import { getStaffSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { saveCoupon } from "@/actions/admin";
import { Button } from "@/components/ui/button";

export default async function DiscountsPage() {
  const session = await getStaffSession();
  if (!session) redirect("/admin/login");
  const [coupons, sales] = await Promise.all([
    prisma.coupon.findMany(),
    prisma.flashSale.findMany(),
  ]);
  return (
    <div>
      <h1 className="font-serif text-3xl">Discounts</h1>
      <form action={saveCoupon} className="mt-6 grid gap-2 rounded-3xl bg-white p-6 md:grid-cols-4">
        <input name="code" required placeholder="CODE" className="h-11 rounded-2xl border px-3" />
        <select name="type" className="h-11 rounded-2xl border px-3">
          <option value="percent">Percent</option>
          <option value="fixed">Fixed</option>
          <option value="free_shipping">Free shipping</option>
        </select>
        <input name="value" type="number" placeholder="Value" className="h-11 rounded-2xl border px-3" />
        <Button type="submit">Create</Button>
      </form>
      <ul className="mt-6 space-y-2">
        {coupons.map((c) => (
          <li key={c.id} className="rounded-2xl bg-white p-4">
            {c.code} · {c.type} {c.value} · used {c.usedCount}
          </li>
        ))}
      </ul>
      <h2 className="mt-10 font-serif text-2xl">Flash sales</h2>
      <ul className="mt-3 space-y-2">
        {sales.map((s) => (
          <li key={s.id} className="rounded-2xl bg-white p-4">
            {s.name} · {s.percent}% · until {s.endsAt.toLocaleString()}
          </li>
        ))}
      </ul>
    </div>
  );
}
