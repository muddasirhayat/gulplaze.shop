import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { StorefrontChrome } from "@/components/storefront/chrome";
import { getTheme } from "@/lib/settings";
import { getMessagesNow } from "@/lib/i18n-server";
import { I18nProvider } from "@/lib/i18n-client";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!routing.locales.includes(locale as "en" | "ur")) notFound();
  const messages = await getMessagesNow();
  const theme = await getTheme();

  return (
    <I18nProvider locale={locale} messages={messages as Record<string, unknown>}>
      <div
        style={
          {
            "--background": theme.background,
            "--primary": theme.primary,
            "--cta": theme.cta,
            "--radius": theme.radius,
          } as React.CSSProperties
        }
      >
        <StorefrontChrome locale={locale}>{children}</StorefrontChrome>
      </div>
    </I18nProvider>
  );
}
