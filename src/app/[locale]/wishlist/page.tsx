import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { ProductCard } from "@/components/storefront/product-card";

export default async function WishlistPage() {
  const session = await getSession();
  if (!session?.user) redirect("/account/login");
  const items = await prisma.wishlistItem.findMany({
    where: { userId: session.user.id },
    include: {
      product: {
        include: {
          images: true,
          variants: true,
          ages: true,
          brand: true,
          category: true,
          reviews: { where: { status: "approved" }, select: { rating: true } },
        },
      },
    },
  });
  return (
    <div className="container-gp py-12">
      <h1 className="font-serif text-4xl">Wishlist</h1>
      <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
        {items.map((i) => (
          <ProductCard key={i.id} product={i.product} />
        ))}
      </div>
    </div>
  );
}
