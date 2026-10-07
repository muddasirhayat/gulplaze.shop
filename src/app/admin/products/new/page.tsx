import { prisma } from "@/lib/prisma";
import { getStaffSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { ProductForm } from "@/components/admin/product-form";

export default async function NewProduct() {
  const session = await getStaffSession();
  if (!session) redirect("/admin/login");
  const [categories, brands] = await Promise.all([
    prisma.category.findMany({ orderBy: { name: "asc" } }),
    prisma.brand.findMany(),
  ]);
  return (
    <div>
      <h1 className="font-serif text-3xl">New product</h1>
      <ProductForm categories={categories} brands={brands} />
    </div>
  );
}
