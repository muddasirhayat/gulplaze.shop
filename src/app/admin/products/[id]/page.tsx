import { prisma } from "@/lib/prisma";
import { getStaffSession } from "@/lib/auth";
import { notFound, redirect } from "next/navigation";
import { ProductForm } from "@/components/admin/product-form";

export default async function EditProduct({ params }: { params: Promise<{ id: string }> }) {
  const session = await getStaffSession();
  if (!session) redirect("/admin/login");
  const { id } = await params;
  const [product, categories, brands] = await Promise.all([
    prisma.product.findUnique({ where: { id }, include: { ages: true, variants: true, images: true } }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
    prisma.brand.findMany(),
  ]);
  if (!product) notFound();
  return (
    <div>
      <h1 className="font-serif text-3xl">Edit product</h1>
      <ProductForm categories={categories} brands={brands} product={product} />
    </div>
  );
}
