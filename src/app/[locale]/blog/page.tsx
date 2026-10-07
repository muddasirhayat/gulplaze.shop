import { prisma } from "@/lib/prisma";
import { Link } from "@/i18n/navigation";

export default async function BlogPage() {
  const posts = await prisma.blogPost.findMany({
    where: { status: "published" },
    include: { category: true },
    orderBy: { publishedAt: "desc" },
  });
  return (
    <div className="container-gp py-12">
      <h1 className="font-serif text-4xl">Journal</h1>
      <p className="mt-2 text-muted">Pregnancy, newborn care, toys by age, and gift ideas.</p>
      <div className="mt-10 grid gap-8 md:grid-cols-3">
        {posts.map((post) => (
          <Link key={post.id} href={`/blog/${post.slug}`}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={post.cover} alt="" className="aspect-[16/10] w-full rounded-3xl object-cover" />
            <p className="mt-3 text-xs uppercase tracking-wide text-muted">{post.category?.name}</p>
            <h2 className="font-serif text-2xl">{post.title}</h2>
            <p className="mt-1 text-sm text-muted">{post.excerpt}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
