import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { parseJson } from "@/lib/utils";
import { getProducts } from "@/lib/catalog";
import { ProductCard } from "@/components/storefront/product-card";

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await prisma.blogPost.findUnique({ where: { slug }, include: { category: true } });
  if (!post) notFound();
  const relatedIds = parseJson<string[]>(post.relatedProducts, []);
  const related = relatedIds.length
    ? await getProducts({ take: 4 })
    : await getProducts({ take: 4, featured: true });
  return (
    <article className="container-gp max-w-3xl py-12">
      <p className="text-sm text-muted">{post.category?.name}</p>
      <h1 className="mt-2 font-serif text-4xl">{post.title}</h1>
      {post.cover ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={post.cover} alt="" className="mt-6 aspect-[16/9] w-full rounded-3xl object-cover" />
      ) : null}
      <div className="prose mt-8 max-w-none leading-relaxed" dangerouslySetInnerHTML={{ __html: post.body }} />
      <div className="mt-12 grid grid-cols-2 gap-4">
        {related.items.slice(0, 4).map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </article>
  );
}
