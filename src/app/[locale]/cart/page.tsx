import { createT } from "@/lib/i18n-server";
import { Link } from "@/i18n/navigation";
import { getCart, cartTotals } from "@/lib/cart";
import { getStoreInfo } from "@/lib/settings";
import { formatPkr } from "@/lib/money";
import { Button } from "@/components/ui/button";
import { getProducts } from "@/lib/catalog";
import { ProductCard } from "@/components/storefront/product-card";
import { CartLineControls } from "@/components/storefront/cart-lines";

export default async function CartPage() {
  const t = await createT("cart");
  const [cart, info, recs] = await Promise.all([getCart(), getStoreInfo(), getProducts({ featured: true, take: 4 })]);
  const items = cart?.items ?? [];
  const totals = cart ? cartTotals(cart, 0, info.giftWrapPrice) : { subtotal: 0, wrap: 0, discount: 0, total: 0 };

  return (
    <div className="container-gp py-12">
      <h1 className="font-serif text-4xl">{t("title")}</h1>
      {!items.length ? (
        <p className="mt-6 text-muted">
          {t("empty")}{" "}
          <Link href="/shop" className="underline">
            {t("continue")}
          </Link>
        </p>
      ) : (
        <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_320px]">
          <CartLineControls items={items} />
          <aside className="h-fit rounded-3xl bg-white p-6 card-shadow">
            <p className="flex justify-between">
              <span>{t("subtotal")}</span>
              <span>{formatPkr(totals.subtotal)}</span>
            </p>
            <Link href="/checkout">
              <Button className="mt-4 w-full">{t("checkout")}</Button>
            </Link>
          </aside>
        </div>
      )}
      <h2 className="mt-16 font-serif text-2xl">{t("alsoLike")}</h2>
      <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
        {recs.items.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </div>
  );
}
