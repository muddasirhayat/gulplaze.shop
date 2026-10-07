import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

export default async function PolicyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = await prisma.page.findUnique({ where: { slug } });
  if (!page) notFound();
  return (
    <div className="container-gp max-w-3xl py-16">
      <h1 className="font-serif text-4xl">{page.title}</h1>
      <div className="mt-6 whitespace-pre-line leading-relaxed text-muted">{page.body}</div>
    </div>
  );
}
