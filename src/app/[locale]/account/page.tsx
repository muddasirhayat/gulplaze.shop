import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Link } from "@/i18n/navigation";
import { redirect } from "next/navigation";
import { formatPkr } from "@/lib/money";
import { AGE_RANGES } from "@/lib/constants";
import { addChild, saveAddress, requestReturn } from "@/actions/account";
import { Button } from "@/components/ui/button";

export default async function AccountPage() {
  const session = await getSession();
  if (!session?.user) redirect("/account/login");
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      orders: { orderBy: { createdAt: "desc" }, take: 10, include: { items: true } },
      addresses: true,
      children: true,
      loyaltyLedger: { orderBy: { createdAt: "desc" }, take: 8 },
    },
  });
  if (!user) redirect("/account/login");

  return (
    <div className="container-gp space-y-12 py-12">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-serif text-4xl">Hello, {user.name.split(" ")[0]}</h1>
          <p className="text-muted">
            {user.loyaltyPoints} reward points · Referral {user.referralCode}
          </p>
        </div>
        <form action="/api/auth/sign-out">
          <Link href="/api/auth/sign-out" className="text-sm underline">
            Sign out
          </Link>
        </form>
      </div>

      <section>
        <h2 className="font-serif text-2xl">Orders</h2>
        <div className="mt-4 space-y-3">
          {user.orders.map((order) => (
            <article key={order.id} className="rounded-3xl bg-white p-5">
              <div className="flex flex-wrap justify-between gap-2">
                <p className="font-medium">{order.number}</p>
                <p className="text-sm">{order.status.replaceAll("_", " ")}</p>
              </div>
              <p className="text-sm text-muted">{formatPkr(order.total)}</p>
              <div className="mt-2 flex flex-wrap gap-3 text-sm">
                <Link className="underline" href={`/order/${order.number}?phone=${order.phone}`}>
                  Track
                </Link>
                <Link className="underline" href={`/account/invoice/${order.number}`}>
                  Invoice
                </Link>
                <form
                  action={async () => {
                    "use server";
                    await requestReturn(order.id, "exchange", "Requested from account");
                  }}
                >
                  <button className="underline">Return / exchange</button>
                </form>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="grid gap-8 md:grid-cols-2">
        <div>
          <h2 className="font-serif text-2xl">Little profiles</h2>
          <ul className="mt-3 space-y-2 text-sm">
            {user.children.map((c) => (
              <li key={c.id}>
                {c.name} · {c.ageKey}
              </li>
            ))}
          </ul>
          <form action={addChild} className="mt-4 space-y-2">
            <input name="name" required placeholder="Name" className="h-11 w-full rounded-2xl border px-3" />
            <input name="birthday" type="date" className="h-11 w-full rounded-2xl border px-3" />
            <select name="ageKey" className="h-11 w-full rounded-2xl border px-3">
              {AGE_RANGES.map((a) => (
                <option key={a.key} value={a.key}>
                  {a.label}
                </option>
              ))}
            </select>
            <Button type="submit" size="sm">
              Save profile
            </Button>
          </form>
        </div>
        <div>
          <h2 className="font-serif text-2xl">Addresses</h2>
          <ul className="mt-3 space-y-2 text-sm">
            {user.addresses.map((a) => (
              <li key={a.id}>
                {a.fullName}, {a.area}, {a.city}
              </li>
            ))}
          </ul>
          <form action={saveAddress} className="mt-4 grid gap-2">
            <input name="fullName" required placeholder="Name" className="h-11 rounded-2xl border px-3" />
            <input name="phone" required placeholder="Phone" className="h-11 rounded-2xl border px-3" />
            <input name="city" required placeholder="City" className="h-11 rounded-2xl border px-3" />
            <input name="area" required placeholder="Area" className="h-11 rounded-2xl border px-3" />
            <input name="address" required placeholder="Address" className="h-11 rounded-2xl border px-3" />
            <Button type="submit" size="sm">
              Save address
            </Button>
          </form>
        </div>
      </section>
    </div>
  );
}
