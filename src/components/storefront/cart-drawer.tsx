"use client";

import { useTransition } from "react";
import { useTranslations } from "@/lib/i18n-client";
import { X } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { applyCoupon, removeCartItem, setCartMeta, updateCartItem } from "@/actions/cart";
import { formatPkr } from "@/lib/money";
import { Button } from "@/components/ui/button";

type Item = {
  id: string;
  quantity: number;
  product: { title: string; slug: string; price: number; images: { url: string }[] };
  variant: { name: string; price: number | null } | null;
};

export function CartDrawer({
  open,
  onClose,
  items,
  subtotal,
  threshold,
  couponCode,
  giftWrap,
  wrapPrice,
}: {
  open: boolean;
  onClose: () => void;
  items: Item[];
  subtotal: number;
  threshold: number;
  couponCode: string | null;
  giftWrap: boolean;
  wrapPrice: number;
}) {
  const t = useTranslations("cart");
  const [, start] = useTransition();
  const remaining = Math.max(0, threshold - subtotal);

  return (
    <>
      <div
        className={`fixed inset-0 z-50 bg-black/20 transition ${open ? "opacity-100" : "pointer-events-none opacity-0"}`}
        onClick={onClose}
      />
      <aside
        className={`fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col bg-white shadow-2xl transition-transform duration-300 ${open ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="flex items-center justify-between border-b border-black/5 px-5 py-4">
          <h2 className="font-serif text-2xl">{t("title")}</h2>
          <button type="button" onClick={onClose} aria-label="Close">
            <X />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-5 py-4">
          {!items.length && <p className="text-muted">{t("empty")}</p>}
          <ul className="space-y-4">
            {items.map((item) => {
              const unit = item.variant?.price ?? item.product.price;
              return (
                <li key={item.id} className="flex gap-3">
                  {item.product.images[0] ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={item.product.images[0].url} alt="" className="h-24 w-20 rounded-2xl object-cover" />
                  ) : null}
                  <div className="flex-1">
                    <Link href={`/product/${item.product.slug}`} className="font-medium" onClick={onClose}>
                      {item.product.title}
                    </Link>
                    {item.variant?.name ? <p className="text-sm text-muted">{item.variant.name}</p> : null}
                    <p className="mt-1 text-sm">{formatPkr(unit)}</p>
                    <div className="mt-2 flex items-center gap-2">
                      <button
                        className="h-8 w-8 rounded-full border"
                        onClick={() => start(() => updateCartItem(item.id, item.quantity - 1))}
                      >
                        −
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        className="h-8 w-8 rounded-full border"
                        onClick={() => start(() => updateCartItem(item.id, item.quantity + 1))}
                      >
                        +
                      </button>
                      <button className="ml-auto text-sm text-muted" onClick={() => start(() => removeCartItem(item.id))}>
                        {t("remove")}
                      </button>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
        <div className="space-y-3 border-t border-black/5 px-5 py-4">
          <div className="h-2 overflow-hidden rounded-full bg-background">
            <div
              className="h-full bg-primary"
              style={{ width: `${Math.min(100, (subtotal / threshold) * 100)}%` }}
            />
          </div>
          <p className="text-sm text-muted">
            {remaining > 0 ? t("freeShip", { amount: formatPkr(remaining) }) : t("freeUnlocked")}
          </p>
          <form
            className="flex gap-2"
            action={(form) => {
              start(() => {
                void applyCoupon(String(form.get("code") || ""));
              });
            }}
          >
            <input
              name="code"
              defaultValue={couponCode ?? ""}
              placeholder={t("coupon")}
              className="h-10 flex-1 rounded-full border border-black/10 px-4 text-sm"
            />
            <Button type="submit" variant="secondary" size="sm">
              {t("apply")}
            </Button>
          </form>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={giftWrap}
              onChange={(e) => start(() => setCartMeta({ giftWrap: e.target.checked }))}
            />
            {t("giftWrap")} ({formatPkr(wrapPrice)})
          </label>
          <div className="flex justify-between font-semibold">
            <span>{t("subtotal")}</span>
            <span>{formatPkr(subtotal + (giftWrap ? wrapPrice : 0))}</span>
          </div>
          <Link href="/checkout" onClick={onClose} className="block">
            <Button className="w-full" type="button">
              {t("checkout")}
            </Button>
          </Link>
          <Link href="/cart" onClick={onClose} className="block text-center text-sm underline">
            View bag
          </Link>
        </div>
      </aside>
    </>
  );
}
