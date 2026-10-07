import { AnnouncementBar } from "@/components/storefront/announcement-bar";
import { Header } from "@/components/storefront/header";
import { Footer } from "@/components/storefront/footer";
import { WhatsAppButton } from "@/components/storefront/whatsapp-button";
import { NewsletterPopup } from "@/components/storefront/newsletter-popup";
import { CookieBanner } from "@/components/storefront/cookie-banner";
import { getCart } from "@/lib/cart";
import { getStoreInfo } from "@/lib/settings";
import { prisma } from "@/lib/prisma";
import { parseJson } from "@/lib/utils";

export async function StorefrontChrome({
  children,
  locale,
}: {
  children: React.ReactNode;
  locale: string;
}) {
  const [cart, info, announcement] = await Promise.all([
    getCart(),
    getStoreInfo(),
    prisma.announcement.findFirst({ where: { active: true } }),
  ]);
  const items = cart?.items ?? [];
  const subtotal = items.reduce((sum, item) => {
    const unit = item.variant?.price ?? item.product.price;
    return sum + unit * item.quantity;
  }, 0);
  const count = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="flex min-h-full flex-col">
      <AnnouncementBar messages={parseJson<string[]>(announcement?.messages, [])} />
      <Header
        locale={locale}
        cart={{
          items: items.map((item) => ({
            id: item.id,
            quantity: item.quantity,
            product: {
              title: item.product.title,
              slug: item.product.slug,
              price: item.product.price,
              images: item.product.images,
            },
            variant: item.variant,
          })),
          subtotal,
          threshold: info.freeShippingThreshold,
          couponCode: cart?.couponCode ?? null,
          giftWrap: Boolean(cart?.giftWrap),
          wrapPrice: info.giftWrapPrice,
          count,
        }}
      />
      <main className="flex-1">{children}</main>
      <Footer />
      <WhatsAppButton />
      <NewsletterPopup />
      <CookieBanner />
    </div>
  );
}
