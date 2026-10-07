import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProductBySlug, relatedProducts, avgRating } from "@/lib/catalog";
import { ProductDetail } from "@/components/storefront/product-detail";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Product" };
  return {
    title: product.metaTitle || product.title,
    description: product.metaDescription || product.description.slice(0, 160),
    openGraph: { images: product.images[0] ? [product.images[0].url] : [] },
  };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();
  const related = await relatedProducts(product.id, product.categoryId);
  const rating = avgRating(product);
  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    image: product.images.map((i) => i.url),
    sku: product.sku,
    brand: product.brand?.name,
    description: product.description,
    offers: {
      "@type": "Offer",
      priceCurrency: "PKR",
      price: product.price,
      availability: product.variants.some((v) => v.stock > 0)
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
    },
    aggregateRating: product.reviews.length
      ? { "@type": "AggregateRating", ratingValue: rating.toFixed(1), reviewCount: product.reviews.length }
      : undefined,
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <ProductDetail product={product} related={related} rating={rating} />
    </>
  );
}
