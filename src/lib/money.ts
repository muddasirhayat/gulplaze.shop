export function formatPkr(amount: number) {
  const n = Math.round(amount);
  return `Rs. ${n.toLocaleString("en-PK")}`;
}

export function discountPercent(price: number, compareAt?: number | null) {
  if (!compareAt || compareAt <= price) return 0;
  return Math.round(((compareAt - price) / compareAt) * 100);
}

export function savingsAmount(price: number, compareAt?: number | null) {
  if (!compareAt || compareAt <= price) return 0;
  return compareAt - price;
}
