"use client";

import { useState } from "react";
import { Heart, Menu, Search, ShoppingBag, User, X } from "lucide-react";
import { useTranslations } from "@/lib/i18n-client";
import { Link } from "@/i18n/navigation";
import { Logo } from "@/components/storefront/logo";
import { SearchBox } from "@/components/storefront/search-box";
import { CartDrawer } from "@/components/storefront/cart-drawer";
import { MEGA_NAV } from "@/lib/constants";

type CartPayload = {
  items: {
    id: string;
    quantity: number;
    product: { title: string; slug: string; price: number; images: { url: string }[] };
    variant: { name: string; price: number | null } | null;
  }[];
  subtotal: number;
  threshold: number;
  couponCode: string | null;
  giftWrap: boolean;
  wrapPrice: number;
  count: number;
};

export function Header({ cart, locale }: { cart: CartPayload; locale: string }) {
  const t = useTranslations("nav");
  const [open, setOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [mega, setMega] = useState<string | null>(null);

  return (
    <header className="sticky top-0 z-40 border-b border-black/5 bg-[#FFF9F3]/90 backdrop-blur">
      <div className="container-gp flex h-16 items-center gap-4 md:h-[72px]">
        <button className="md:hidden" onClick={() => setOpen(true)} aria-label={t("menu")}>
          <Menu />
        </button>
        <div className="flex flex-1 justify-center md:flex-none md:justify-start">
          <Logo />
        </div>
        <nav className="hidden flex-1 items-center justify-center gap-6 text-sm font-medium lg:flex">
          {MEGA_NAV.map((item) => (
            <div
              key={item.label}
              className="relative"
              onMouseEnter={() => setMega(item.label)}
              onMouseLeave={() => setMega(null)}
            >
              <Link href={item.href} className="hover:text-cta">
                {item.label}
              </Link>
              {mega === item.label && item.groups.length > 0 && (
                <div className="absolute left-1/2 top-full z-50 w-[640px] -translate-x-1/2 pt-3">
                  <div className="grid grid-cols-3 gap-6 rounded-3xl bg-white p-6 card-shadow">
                    {item.groups.map((group) => (
                      <div key={group.title}>
                        <p className="mb-2 font-serif text-lg">{group.title}</p>
                        <ul className="space-y-1.5 text-muted">
                          {group.links.map((link) => (
                            <li key={link.href}>
                              <Link href={link.href} className="hover:text-text">
                                {link.label}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                    <div className="rounded-2xl bg-blush/40 p-4">
                      <p className="font-serif text-lg">{item.featured?.title}</p>
                      {item.featured ? (
                        <Link href={item.featured.href} className="mt-2 inline-block text-sm underline">
                          Shop now
                        </Link>
                      ) : null}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <SearchBox />
          <button className="md:hidden" onClick={() => setSearchOpen((v) => !v)} aria-label={t("search")}>
            <Search className="h-5 w-5" />
          </button>
          <Link href="/account" aria-label={t("account")}>
            <User className="h-5 w-5" />
          </Link>
          <Link href="/wishlist" aria-label={t("wishlist")} className="hidden sm:block">
            <Heart className="h-5 w-5" />
          </Link>
          <button type="button" className="relative" onClick={() => setCartOpen(true)} aria-label={t("cart")}>
            <ShoppingBag className="h-5 w-5" />
            {cart.count > 0 && (
              <span className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-cta px-1 text-[10px] font-bold text-white">
                {cart.count}
              </span>
            )}
          </button>
          <Link href={locale === "ur" ? "/" : "/ur"} className="hidden text-xs font-semibold uppercase sm:block">
            {locale === "ur" ? "EN" : "اردو"}
          </Link>
        </div>
      </div>
      {searchOpen && (
        <div className="border-t border-black/5 px-4 py-3 md:hidden">
          <SearchBox compact />
        </div>
      )}
      {open && (
        <div className="fixed inset-0 z-50 bg-white md:hidden">
          <div className="flex items-center justify-between px-4 py-4">
            <Logo />
            <button onClick={() => setOpen(false)} aria-label="Close">
              <X />
            </button>
          </div>
          <nav className="flex flex-col gap-4 px-6 text-lg">
            {MEGA_NAV.map((item) => (
              <Link key={item.label} href={item.href} onClick={() => setOpen(false)}>
                {item.label}
              </Link>
            ))}
            <Link href="/shop" onClick={() => setOpen(false)}>
              {t("shopAll")}
            </Link>
            <Link href="/blog" onClick={() => setOpen(false)}>
              {t("blog")}
            </Link>
          </nav>
        </div>
      )}
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} {...cart} />
    </header>
  );
}
