import type { Metadata } from "next";
import { Fraunces, Nunito, Noto_Nastaliq_Urdu } from "next/font/google";
import { getLocaleNow } from "@/lib/i18n-server";
import { Toaster } from "sonner";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
});

const nunito = Nunito({
  subsets: ["latin"],
  variable: "--font-nunito",
});

const nastaliq = Noto_Nastaliq_Urdu({
  subsets: ["arabic"],
  variable: "--font-nastaliq",
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "GulPlaze — Where little ones bloom",
    template: "%s · GulPlaze",
  },
  description:
    "Premium newborn and kids clothing, toys, and mother care in Pakistan. Soft, calm, and made for everyday love.",
  icons: { icon: "/icon.svg" },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const locale = await getLocaleNow();
  return (
    <html
      lang={locale}
      dir={locale === "ur" ? "rtl" : "ltr"}
      className={`${fraunces.variable} ${nunito.variable} ${nastaliq.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-background text-text">
        {children}
        <Toaster richColors position="top-center" />
      </body>
    </html>
  );
}
