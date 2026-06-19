/**
 * Format an hourly/engagement rate in the given currency.
 * Preserves up to 2 decimals (so 10.50 stays 10.50, never rounds to 11) while
 * keeping whole amounts clean (15 → £15, not £15.00).
 */
export function formatRate(amount: number, currency = "USD"): string {
  const hasFraction = !Number.isInteger(amount);
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency || "USD",
    minimumFractionDigits: hasFraction ? 2 : 0,
    maximumFractionDigits: 2,
  }).format(amount);
}
