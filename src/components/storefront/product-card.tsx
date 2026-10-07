"use client";

import { useState, useTransition } from "react";
import { Heart, Plus } from "lucide-react";
import { useTranslations } from "@/lib/i18n-client";
import { Link } from "@/i18n/navigation";
import { addToCart } from "@/actions/cart";
import { formatPkr, discountPercent } from "@/lib/money";
import { AGE_RANGES } from "@/lib/constants";
import { cn } from "@/lib/utils";

export type CardProduct = {
  id: string;
  title: string;
  slug: string;
  price: number;
  compareAt?: number | null;
  featured?: boolean;
  bestSeller?: boolean;
  giftReady?: boolean;
  images: { url: string; alt?: string }[];
  ages: { ageKey: string }[];
  variants: { id: string; stock: number; colorHex?: string | null; color?: string | null }[];
};

export function ProductCard({ product }: { product: CardProduct }) {
  const t = useTranslations();
  const [hover, setHover] = useState(false);
  const [pending, start] = useTransition();
  const img = product.images[0];
  const img2 = product.images[1];
  const pct = discountPercent(product.price, product.compareAt);
  const age = AGE_RANGES.find((a) => a.key === product.ages[0]?.ageKey);
  const inStock = product.variants.some((v) => v.stock > 0);
  const low = product.variants.some((v) => v.stock > 0 && v.stock <= 5);

  return (
    <article
      className="group relative"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <Link href={`/product/${product.slug}`} className="block">
        <div className="relative aspect-[4/5] overflow-hidden rounded-[20px] bg-white card-shadow">
          {img ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={hover && img2 ? img2.url : img.url}
              alt={img.alt || product.title}
              className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
            />
          ) : (
            <div className="h-full w-full bg-blush/40" />
          )}
          <div className="absolute left-3 top-3 flex flex-col gap-1">
            {pct > 0 && (
              <span className="rounded-full bg-cta px-2 py-0.5 text-[11px] font-semibold text-white">
                -{pct}%
              </span>
            )}
            {product.bestSeller && (
              <span className="rounded-full bg-primary px-2 py-0.5 text-[11px] font-semibold text-text">
                {t("common.best")}
              </span>
            )}
            {product.giftReady && (
              <span className="rounded-full bg-sky px-2 py-0.5 text-[11px] font-semibold text-text">
                {t("common.gift")}
              </span>
            )}
            {low && inStock && (
              <span className="rounded-full bg-white/90 px-2 py-0.5 text-[11px] font-semibold">
                {t("common.low")}
              </span>
            )}
          </div>
          {age && (
            <span className="absolute bottom-3 left-3 rounded-full px-2.5 py-0.5 text-[11px] font-semibold text-text" style={{ background: age.pastel }}>
              {age.label}
            </span>
          )}
        </div>
        <h3 className="mt-3 font-medium leading-snug">{product.title}</h3>
        <p className="mt-1 flex items-center gap-2">
          <span className="font-semibold">{formatPkr(product.price)}</span>
          {product.compareAt && product.compareAt > product.price && (
            <span className="text-sm text-muted line-through">{formatPkr(product.compareAt)}</span>
          )}
        </p>
        <div className="mt-2 flex gap-1">
          {product.variants
            .filter((v) => v.colorHex)
            .slice(0, 4)
            .map((v) => (
              <span
                key={v.id}
                className="h-3.5 w-3.5 rounded-full border border-black/10"
                style={{ background: v.colorHex || undefined }}
              />
            ))}
        </div>
      </Link>
      <button
        type="button"
        aria-label={t("product.wishlist")}
        className="absolute right-3 top-3 rounded-full bg-white/90 p-2 shadow-sm"
      >
        <Heart className="h-4 w-4" />
      </button>
      <button
        type="button"
        disabled={pending || !inStock}
        onClick={() =>
          start(() => {
            void addToCart(product.id, product.variants.find((v) => v.stock > 0)?.id);
          })
        }
        className={cn(
          "absolute bottom-20 right-3 hidden rounded-full bg-cta p-2 text-white shadow-sm md:group-hover:flex",
          pending && "opacity-60",
        )}
        aria-label={t("product.quickAdd")}
      >
        <Plus className="h-4 w-4" />
      </button>
    </article>
  );
}
