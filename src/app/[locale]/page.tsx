import { createT } from "@/lib/i18n-server";
import { Link } from "@/i18n/navigation";
import { AGE_RANGES } from "@/lib/constants";
import { getProducts } from "@/lib/catalog";
import { prisma } from "@/lib/prisma";
import { ProductCard } from "@/components/storefront/product-card";
import { parseJson } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export default async function HomePage() {
  const t = await createT("home");
  const [sections, bestClothes, bestToys, bestMother, newest, posts, reviews] = await Promise.all([
    prisma.homepageSection.findMany({ where: { visible: true }, orderBy: { sortOrder: "asc" } }),
    getProducts({ bestSeller: true, type: "clothing", take: 8 }),
    getProducts({ bestSeller: true, type: "toys", take: 8 }),
    getProducts({ bestSeller: true, type: "gear", take: 8 }).then(async (r) =>
      r.items.length ? r : getProducts({ category: "mother-care", take: 8 }),
    ),
    getProducts({ sort: "newest", take: 8 }),
    prisma.blogPost.findMany({ where: { status: "published" }, orderBy: { publishedAt: "desc" }, take: 3 }),
    prisma.review.findMany({
      where: { status: "approved" },
      include: { product: { include: { images: { take: 1 } } } },
      take: 8,
      orderBy: { createdAt: "desc" },
    }),
  ]);

  const hero = sections.find((s) => s.type === "hero");
  const slides = parseJson<{ headline: string; line: string; cta: string; href: string; image: string }[]>(
    hero?.data,
    [],
  );
  const slide = slides[0];
  const categories = [
    { name: "Newborn", href: "/category/newborn", image: newest.items[0]?.images[0]?.url },
    { name: "Clothes", href: "/category/kids", image: newest.items[1]?.images[0]?.url },
    { name: "Toys", href: "/category/toys", image: newest.items[2]?.images[0]?.url },
    { name: "Mother Care", href: "/category/mother-care", image: newest.items[3]?.images[0]?.url },
    { name: "Gifts", href: "/gifts", image: newest.items[4]?.images[0]?.url },
  ];

  return (
    <>
      {slide && (
        <section className="relative min-h-[70vh] overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={slide.image} alt="" className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-black/5" />
          <div className="container-gp relative flex min-h-[70vh] flex-col justify-end pb-16 pt-32 text-white">
            <p className="text-sm tracking-widest uppercase opacity-90">GulPlaze</p>
            <h1 className="max-w-xl font-serif text-4xl md:text-6xl">{t("heroTitle")}</h1>
            <p className="mt-3 max-w-md text-lg">{t("heroLine")}</p>
            <Link href="/shop?sort=newest" className="mt-6">
              <Button size="lg">{t("shopNew")}</Button>
            </Link>
          </div>
        </section>
      )}

      <section className="section-pad">
        <div className="container-gp">
          <h2 className="font-serif text-3xl md:text-4xl">{t("shopAge")}</h2>
          <div className="no-scrollbar mt-8 flex gap-4 overflow-x-auto pb-2 md:grid md:grid-cols-8 md:overflow-visible">
            {AGE_RANGES.map((age) => (
              <Link
                key={age.key}
                href={`/age/${age.key}`}
                className="flex min-w-[120px] flex-col items-center gap-3"
              >
                <span
                  className="flex h-24 w-24 items-center justify-center rounded-full text-sm font-semibold md:h-28 md:w-28"
                  style={{ background: age.pastel }}
                >
                  {age.label.split(" ")[0]}
                </span>
                <span className="text-center text-sm">{age.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section-pad pt-0">
        <div className="container-gp">
          <h2 className="font-serif text-3xl">{t("shopCategory")}</h2>
          <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-5">
            {categories.map((cat) => (
              <Link key={cat.name} href={cat.href} className="group relative aspect-[4/5] overflow-hidden rounded-[24px]">
                {cat.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={cat.image} alt="" className="h-full w-full object-cover transition group-hover:scale-105" />
                ) : (
                  <div className="h-full w-full bg-sky" />
                )}
                <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/50 p-4 font-serif text-xl text-white">
                  {cat.name}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section-pad bg-white/60">
        <div className="container-gp">
          <h2 className="font-serif text-3xl">{t("bestSellers")}</h2>
          <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
            {(bestClothes.items.length ? bestClothes.items : newest.items).slice(0, 4).map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
          <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
            {(bestToys.items.length ? bestToys.items : newest.items).slice(0, 4).map((p) => (
              <ProductCard key={`t-${p.id}`} product={p} />
            ))}
          </div>
        </div>
      </section>

      <section className="container-gp section-pad">
        <div className="grid overflow-hidden rounded-[28px] md:grid-cols-2">
          <div className="bg-blush/50 p-10 md:p-16">
            <h2 className="font-serif text-4xl">{t("giftBannerTitle")}</h2>
            <p className="mt-3 max-w-md text-muted">{t("giftBannerText")}</p>
            <Link href="/gifts" className="mt-6 inline-block">
              <Button>{t("shopGifts")}</Button>
            </Link>
          </div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={newest.items.find((p) => p.giftReady)?.images[0]?.url || slide?.image}
            alt=""
            className="h-full min-h-[280px] w-full object-cover"
          />
        </div>
      </section>

      <section className="section-pad pt-0">
        <div className="container-gp">
          <h2 className="font-serif text-3xl">{t("newArrivals")}</h2>
          <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
            {newest.items.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-sky/40 section-pad">
        <div className="container-gp grid items-center gap-10 md:grid-cols-2">
          <div>
            <h2 className="font-serif text-4xl">{t("motherTitle")}</h2>
            <p className="mt-3 text-muted">{t("motherText")}</p>
            <Link href="/category/mother-care" className="mt-6 inline-block">
              <Button variant="secondary">Shop mother care</Button>
            </Link>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {bestMother.items.slice(0, 3).map((p) => (
              <Link key={p.id} href={`/product/${p.slug}`} className="overflow-hidden rounded-3xl">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.images[0]?.url} alt={p.title} className="aspect-[4/5] w-full object-cover" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section-pad">
        <div className="container-gp grid grid-cols-2 gap-6 md:grid-cols-4">
          {[
            [t("trustQuality"), "Every piece is checked before it leaves us."],
            [t("trustReturns"), "Unused clothing exchanges within 7 days."],
            [t("trustPay"), "COD, bank transfer and wallets."],
            [t("trustShip"), "Metro cities in 1–3 working days."],
          ].map(([title, line]) => (
            <div key={title} className="rounded-3xl bg-white p-6 card-shadow">
              <h3 className="font-serif text-xl">{title}</h3>
              <p className="mt-2 text-sm text-muted">{line}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section-pad pt-0">
        <div className="container-gp">
          <h2 className="font-serif text-3xl">{t("reviews")}</h2>
          <div className="no-scrollbar mt-8 flex gap-4 overflow-x-auto">
            {reviews.map((r) => (
              <article key={r.id} className="min-w-[260px] rounded-3xl bg-white p-5 card-shadow">
                <p className="text-cta">{"★".repeat(r.rating)}</p>
                <p className="mt-2 font-medium">{r.title || r.authorName}</p>
                <p className="mt-1 text-sm text-muted">{r.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section-pad pt-0">
        <div className="container-gp">
          <h2 className="font-serif text-3xl">{t("budget")}</h2>
          <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
            {[1500, 3000, 5000, "premium"].map((n) => (
              <Link
                key={String(n)}
                href={n === "premium" ? "/gifts?budget=premium" : `/gifts?max=${n}`}
                className="rounded-3xl bg-white p-6 text-center font-serif text-xl card-shadow"
              >
                {n === "premium" ? "Premium" : `Under Rs. ${Number(n).toLocaleString("en-PK")}`}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section-pad pt-0">
        <div className="container-gp">
          <h2 className="font-serif text-3xl">{t("journal")}</h2>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {posts.map((post) => (
              <Link key={post.id} href={`/blog/${post.slug}`} className="group">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={post.cover} alt="" className="aspect-[16/10] w-full rounded-3xl object-cover" />
                <h3 className="mt-3 font-serif text-xl group-hover:text-cta">{post.title}</h3>
                <p className="mt-1 text-sm text-muted">{post.excerpt}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section-pad pt-0">
        <div className="container-gp">
          <h2 className="font-serif text-3xl">{t("instagram")}</h2>
          <div className="mt-6 grid grid-cols-3 gap-2 md:grid-cols-6">
            {newest.items.slice(0, 6).map((p) => (
              <div key={p.id} className="aspect-square overflow-hidden rounded-2xl">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.images[0]?.url} alt="" className="h-full w-full object-cover" />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-primary/30 section-pad">
        <div className="container-gp max-w-xl text-center">
          <h2 className="font-serif text-3xl">{t("newsletterTitle")}</h2>
          <p className="mt-2 text-muted">{t("newsletterText")}</p>
          <form action="/api/newsletter" method="post" className="mt-6 flex gap-2">
            <input name="email" type="email" required placeholder={t("email")} className="h-12 flex-1 rounded-full border-0 bg-white px-5" />
            <Button type="submit">{t("subscribe")}</Button>
          </form>
        </div>
      </section>
    </>
  );
}
