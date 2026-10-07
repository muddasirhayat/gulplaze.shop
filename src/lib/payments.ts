export type PaymentMethod = "cod" | "bank_transfer" | "jazzcash" | "easypaisa" | "card";

export const PAYMENT_METHODS: { id: PaymentMethod; label: string; phase: 1 | 2 }[] = [
  { id: "cod", label: "Cash on Delivery", phase: 1 },
  { id: "bank_transfer", label: "Bank transfer", phase: 1 },
  { id: "jazzcash", label: "JazzCash", phase: 2 },
  { id: "easypaisa", label: "Easypaisa", phase: 2 },
  { id: "card", label: "Debit / credit card", phase: 2 },
];

export async function createGatewaySession(method: PaymentMethod, orderId: string, amount: number) {
  if (method === "cod" || method === "bank_transfer") {
    return { redirectUrl: null as string | null, reference: `${method}_${orderId}` };
  }
  return {
    redirectUrl: `/checkout/mock-pay?order=${orderId}&method=${method}&amount=${amount}`,
    reference: `${method}_${orderId}_${Date.now()}`,
  };
}

export function verifyGatewayCallback(_payload: Record<string, string>) {
  return { ok: true, status: "paid" as const };
}
