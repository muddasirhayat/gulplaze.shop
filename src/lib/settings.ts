import { prisma } from "@/lib/prisma";
import { parseJson } from "@/lib/utils";
import { FREE_SHIPPING_THRESHOLD, GIFT_WRAP_PRICE } from "@/lib/constants";

export type ThemeSettings = {
  logoText: string;
  background: string;
  primary: string;
  cta: string;
  radius: string;
};

const defaultTheme: ThemeSettings = {
  logoText: "gulplaze",
  background: "#FFF9F3",
  primary: "#A8C3A0",
  cta: "#F2836B",
  radius: "18px",
};

export async function getSetting<T>(key: string, fallback: T): Promise<T> {
  const row = await prisma.setting.findUnique({ where: { key } });
  return parseJson(row?.value, fallback);
}

export async function setSetting(key: string, value: unknown) {
  const serialized = JSON.stringify(value);
  await prisma.setting.upsert({
    where: { key },
    update: { value: serialized },
    create: { key, value: serialized },
  });
}

export async function getStoreInfo() {
  return getSetting("storeInfo", {
    name: "GulPlaze",
    tagline: "Where little ones bloom",
    email: "hello@gulplaze.shop",
    phone: "+92 300 1234567",
    whatsapp: process.env.NEXT_PUBLIC_WHATSAPP || "923001234567",
    address: "DHA Phase 6, Lahore, Pakistan",
    instagram: "https://instagram.com/gulplaze",
    facebook: "https://facebook.com/gulplaze",
    tiktok: "https://tiktok.com/@gulplaze",
    freeShippingThreshold: FREE_SHIPPING_THRESHOLD,
    giftWrapPrice: GIFT_WRAP_PRICE,
    bankName: "Meezan Bank",
    bankAccount: "GulPlaze",
    bankIban: "PK00MEZN0000000000000000",
    pixels: {
      ga4: "",
      gtm: "",
      meta: "",
      tiktok: "",
    },
  });
}

export async function getTheme() {
  return getSetting("theme", defaultTheme);
}
