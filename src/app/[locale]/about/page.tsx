import { prisma } from "@/lib/prisma";

export default async function AboutPage() {
  const page = await prisma.page.findUnique({ where: { slug: "about" } });
  return (
    <div className="container-gp max-w-3xl py-16">
      <h1 className="font-serif text-4xl">{page?.title ?? "About Us"}</h1>
      <div className="mt-6 whitespace-pre-line text-lg leading-relaxed text-muted">{page?.body}</div>
    </div>
  );
}
