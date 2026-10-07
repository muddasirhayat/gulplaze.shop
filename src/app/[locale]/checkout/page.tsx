import { getCart, cartTotals } from "@/lib/cart";
import { getStoreInfo } from "@/lib/settings";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { CheckoutForm } from "@/components/storefront/checkout-form";
import { formatPkr } from "@/lib/money";
import { Link } from "@/i18n/navigation";

export default async function CheckoutPage() {
  const [cart, info, session] = await Promise.all([getCart(), getStoreInfo(), getSession()]);
  if (!cart?.items.length) {
    return (
      <div className="container-gp py-16">
        <p>Your basket is empty.</p>
        <Link href="/shop" className="underline">
          Continue shopping
        </Link>
      </div>
    );
  }
  const user = session?.user
    ? await prisma.user.findUnique({
        where: { id: session.user.id },
        include: { addresses: true },
      })
    : null;
  const totals = cartTotals(cart, 0, info.giftWrapPrice);
  return (
    <div className="container-gp grid gap-10 py-12 lg:grid-cols-[1fr_360px]">
      <CheckoutForm
        bank={info}
        loyalty={user?.loyaltyPoints ?? 0}
        address={user?.addresses[0] ?? null}
        defaultName={user?.name ?? ""}
        defaultEmail={user?.email ?? ""}
        defaultPhone={user?.phone ?? ""}
      />
      <aside className="h-fit rounded-3xl bg-white p-6 card-shadow">
        <h2 className="font-serif text-2xl">Order summary</h2>
        <ul className="mt-4 space-y-3">
          {cart.items.map((item) => (
            <li key={item.id} className="flex gap-3 text-sm">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={item.product.images[0]?.url} alt="" className="h-16 w-14 rounded-xl object-cover" />
              <span className="flex-1">
                {item.product.title}
                <br />
                × {item.quantity}
              </span>
              <span>{formatPkr((item.variant?.price ?? item.product.price) * item.quantity)}</span>
            </li>
          ))}
        </ul>
        <p className="mt-4 flex justify-between font-semibold">
          <span>Subtotal</span>
          <span>{formatPkr(totals.total)}</span>
        </p>
        <p className="mt-2 text-xs text-muted">Shipping calculated at next step by city. Free over {formatPkr(info.freeShippingThreshold)}.</p>
      </aside>
    </div>
  );
}
