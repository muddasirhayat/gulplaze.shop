import { prisma } from "@/lib/prisma";
import { getStoreInfo } from "@/lib/settings";

export async function getShippingRate(city: string, weightGrams: number, orderValue: number) {
  const info = await getStoreInfo();
  if (orderValue >= info.freeShippingThreshold) return 0;

  const rates = await prisma.shippingRate.findMany({
    where: { city },
    orderBy: { rate: "asc" },
  });
  const match = rates.find(
    (r) => weightGrams >= r.minWeight && weightGrams <= r.maxWeight && orderValue >= r.minValue,
  );
  if (match) return match.rate;

  const fallback = await prisma.shippingRate.findFirst({
    where: { city: "Default" },
  });
  return fallback?.rate ?? 250;
}

export function estimateDays(city: string) {
  const metro = ["Karachi", "Lahore", "Islamabad", "Rawalpindi"];
  return metro.includes(city) ? "1–3 working days" : "3–5 working days";
}
