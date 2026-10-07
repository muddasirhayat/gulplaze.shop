export type CourierId = "mock" | "tcs" | "leopards" | "trax" | "postex";

export type Booking = {
  trackingNumber: string;
  labelUrl?: string;
  courier: CourierId;
};

export async function bookShipment(
  courier: CourierId,
  orderNumber: string,
  city: string,
): Promise<Booking> {
  const trackingNumber = `${courier.toUpperCase()}-${orderNumber}-${city.slice(0, 3).toUpperCase()}`;
  console.info(`[courier:${courier}] booked ${trackingNumber}`);
  return { trackingNumber, courier, labelUrl: `/admin/orders/print?n=${orderNumber}` };
}

export function trackingUrl(courier: CourierId, trackingNumber: string) {
  const map: Record<CourierId, string> = {
    mock: `#${trackingNumber}`,
    tcs: `https://www.tcsexpress.com/track/${trackingNumber}`,
    leopards: `https://www.leopardscourier.com/tracking/${trackingNumber}`,
    trax: `https://trax.pk/tracking/${trackingNumber}`,
    postex: `https://postex.pk/track/${trackingNumber}`,
  };
  return map[courier];
}
