"use client";

import { useMemo, useState, useTransition } from "react";
import { useTranslations } from "@/lib/i18n-client";
import { Heart, Share2 } from "lucide-react";
import { Link, useRouter } from "@/i18n/navigation";
import { addToCart } from "@/actions/cart";
import { formatPkr, discountPercent, savingsAmount } from "@/lib/money";
import { AGE_RANGES, PAKISTAN_CITIES } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { ProductCard, type CardProduct } from "@/components/storefront/product-card";
import { toggleWishlist } from "@/actions/account";

type Product = {
  id: string;
  title: string;
  slug: string;
  price: number;
  compareAt?: number | null;
  sku?: string | null;
  brand?: { name: string } | null;
  description: string;
  care: string;
  safety: string;
  material: string;
  giftWrapOk: boolean;
  images: { url: string; alt?: string }[];
  ages: { ageKey: string }[];
  reviews: { id: string; authorName: string; rating: number; title: string; body: string; verified: boolean; photos: string }[];
  questions: { id: string; authorName: string; body: string; answers: { body: string; staff: boolean }[] }[];
  variants: { id: string; name: string; size: string; color: string; colorHex: string; stock: number; sku: string; price: number | null }[];
};

export function ProductDetail({
  product,
  related,
  rating,
}: {
  product: Product;
  related: CardProduct[];
  rating: number;
}) {
  const t = useTranslations("product");
  const router = useRouter();
  const [img, setImg] = useState(0);
  const [size, setSize] = useState(product.variants[0]?.size ?? "");
  const [color, setColor] = useState(product.variants[0]?.color ?? "");
  const [qty, setQty] = useState(1);
  const [city, setCity] = useState("Lahore");
  const [tab, setTab] = useState("description");
  const [, start] = useTransition();

  const variant = useMemo(
    () =>
      product.variants.find((v) => (!size || v.size === size) && (!color || v.color === color)) ??
      product.variants[0],
    [product.variants, size, color],
  );
  const price = variant?.price ?? product.price;
  const pct = discountPercent(price, product.compareAt);
  const ages = product.ages.map((a) => AGE_RANGES.find((x) => x.key === a.ageKey)?.label).filter(Boolean);
  const sizes = [...new Set(product.variants.map((v) => v.size).filter(Boolean))];
  const colors = [...new Set(product.variants.map((v) => v.color).filter(Boolean))];
  const stock = variant?.stock ?? 0;

  function add(buyNow = false) {
    start(async () => {
      await addToCart(product.id, variant?.id, qty);
      if (buyNow) router.push("/checkout");
    });
  }

  return (
    <div className="container-gp py-10">
      <div className="grid gap-10 lg:grid-cols-2">
        <div>
          <div className="overflow-hidden rounded-[28px] bg-white">
            {product.images[img] ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={product.images[img].url} alt={product.title} className="aspect-[4/5] w-full object-cover" />
            ) : null}
          </div>
          <div className="mt-3 flex gap-2 overflow-x-auto">
            {product.images.map((image, i) => (
              <button key={image.url} onClick={() => setImg(i)} className={`h-20 w-16 overflow-hidden rounded-2xl ${i === img ? "ring-2 ring-cta" : ""}`}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={image.url} alt="" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        </div>
        <div>
          <p className="text-sm text-muted">
            {product.brand?.name} · {t("sku")} {variant?.sku || product.sku}
          </p>
          <h1 className="mt-2 font-serif text-4xl">{product.title}</h1>
          {product.reviews.length > 0 && (
            <p className="mt-2 text-sm">
              {"★".repeat(Math.round(rating))} {rating.toFixed(1)} ({product.reviews.length})
            </p>
          )}
          <div className="mt-4 flex items-end gap-3">
            <span className="text-3xl font-semibold">{formatPkr(price)}</span>
            {product.compareAt && product.compareAt > price && (
              <>
                <span className="text-muted line-through">{formatPkr(product.compareAt)}</span>
                <span className="rounded-full bg-cta/15 px-2 py-0.5 text-sm text-cta">
                  Save {formatPkr(savingsAmount(price, product.compareAt))} ({pct}%)
                </span>
              </>
            )}
          </div>
          <p className="mt-1 text-sm text-muted">{t("inclusive")}</p>
          <p className="mt-4 text-sm">
            {t("age")}: {ages.join(", ")}
          </p>
          {colors.length > 0 && (
            <div className="mt-4">
              <p className="text-sm font-semibold">{t("color")}</p>
              <div className="mt-2 flex gap-2">
                {colors.map((c) => {
                  const v = product.variants.find((x) => x.color === c);
                  return (
                    <button
                      key={c}
                      onClick={() => setColor(c ?? "")}
                      className={`h-9 rounded-full border px-3 text-sm ${color === c ? "border-cta" : ""} ${v && v.stock <= 0 ? "line-through opacity-50" : ""}`}
                    >
                      {c}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
          {sizes.length > 0 && (
            <div className="mt-4">
              <p className="text-sm font-semibold">{t("size")}</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {sizes.map((s) => {
                  const v = product.variants.find((x) => x.size === s && (!color || x.color === color));
                  const oos = (v?.stock ?? 0) <= 0;
                  return (
                    <button
                      key={s}
                      onClick={() => setSize(s)}
                      className={`h-10 min-w-12 rounded-full border px-3 text-sm ${size === s ? "border-cta bg-cta/10" : ""} ${oos ? "line-through opacity-40" : ""}`}
                    >
                      {s}
                    </button>
                  );
                })}
              </div>
              <Link href="/size-guide" className="mt-2 inline-block text-sm underline">
                {t("sizeGuide")}
              </Link>
            </div>
          )}
          <div className="mt-4 flex items-center gap-3">
            <span className="text-sm">{t("qty")}</span>
            <button className="h-10 w-10 rounded-full border" onClick={() => setQty((n) => Math.max(1, n - 1))}>
              −
            </button>
            <span>{qty}</span>
            <button className="h-10 w-10 rounded-full border" onClick={() => setQty((n) => n + 1)}>
              +
            </button>
          </div>
          <p className="mt-3 text-sm">
            {stock <= 0 ? t("outOfStock") : stock <= 5 ? t("lowStock", { count: stock }) : t("inStock")}
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button onClick={() => add()} disabled={stock <= 0}>
              {t("addToCart")}
            </Button>
            <Button variant="secondary" onClick={() => add(true)} disabled={stock <= 0}>
              {t("buyNow")}
            </Button>
            <button className="rounded-full border p-3" onClick={() => start(() => { void toggleWishlist(product.id); })}>
              <Heart className="h-5 w-5" />
            </button>
            <a
              className="rounded-full border p-3"
              href={`https://wa.me/?text=${encodeURIComponent(product.title + " " + (typeof window !== "undefined" ? window.location.href : ""))}`}
            >
              <Share2 className="h-5 w-5" />
            </a>
          </div>
          <div className="mt-6 grid grid-cols-3 gap-3 text-center text-xs">
            <div className="rounded-2xl bg-white p-3">{t("cod")}</div>
            <div className="rounded-2xl bg-white p-3">{t("exchange")}</div>
            <div className="rounded-2xl bg-white p-3">{t("authentic")}</div>
          </div>
          <label className="mt-6 block text-sm">
            Delivery estimate
            <select className="mt-1 w-full rounded-2xl border p-2" value={city} onChange={(e) => setCity(e.target.value)}>
              {PAKISTAN_CITIES.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
            <span className="mt-1 block text-muted">
              {["Karachi", "Lahore", "Islamabad", "Rawalpindi"].includes(city) ? "1–3 working days" : "3–5 working days"} · COD available
            </span>
          </label>
          <div className="mt-8">
            <div className="flex gap-4 border-b text-sm">
              {["description", "care", "safety", "shipping"].map((key) => (
                <button key={key} className={`pb-2 ${tab === key ? "border-b-2 border-cta" : "text-muted"}`} onClick={() => setTab(key)}>
                  {t(key === "care" ? "care" : key === "shipping" ? "shipping" : key)}
                </button>
              ))}
            </div>
            <div className="prose mt-4 max-w-none text-sm leading-relaxed">
              {tab === "description" && <p>{product.description}</p>}
              {tab === "care" && (
                <p>
                  {product.material}. {product.care}
                </p>
              )}
              {tab === "safety" && <p>{product.safety}</p>}
              {tab === "shipping" && (
                <p>
                  Free delivery over Rs. 3,000. Unused clothing may be exchanged within 7 days. Opened feeding, bath and
                  skincare cannot be returned for hygiene.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      <section className="mt-16">
        <h2 className="font-serif text-3xl">{t("reviews")}</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {product.reviews.map((r) => (
            <article key={r.id} className="rounded-3xl bg-white p-5">
              <p className="text-cta">{"★".repeat(r.rating)}</p>
              <p className="font-medium">
                {r.authorName} {r.verified ? "· Verified buyer" : ""}
              </p>
              <p className="text-sm text-muted">{r.body}</p>
            </article>
          ))}
        </div>
      </section>

      {product.questions.length > 0 && (
        <section className="mt-12">
          <h2 className="font-serif text-3xl">{t("questions")}</h2>
          <ul className="mt-4 space-y-3">
            {product.questions.map((q) => (
              <li key={q.id} className="rounded-2xl bg-white p-4">
                <p className="font-medium">{q.body}</p>
                {q.answers.map((a, i) => (
                  <p key={i} className="mt-1 text-sm text-muted">
                    {a.staff ? "GulPlaze: " : ""}
                    {a.body}
                  </p>
                ))}
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="mt-16">
        <h2 className="font-serif text-3xl">{t("related")}</h2>
        <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
          {related.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      <div className="fixed inset-x-0 bottom-0 z-30 border-t bg-white p-3 md:hidden">
        <Button className="w-full" onClick={() => add()} disabled={stock <= 0}>
          {t("addToCart")} · {formatPkr(price)}
        </Button>
      </div>
    </div>
  );
}
