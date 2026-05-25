import { CURRENCIES } from "@/lib/data/currencies";

const SYMBOL_BY_CODE = new Map<string, string>(
  CURRENCIES.map((c) => [c.code, c.symbol]),
);

export type BudgetType = "hourly" | "monthly" | "annual" | string | undefined;

export interface FormatBudgetOptions {
  /** Pass true when the min/max are stored in cents (admin / agency views). */
  fromCents?: boolean;
  /** Returned when both min and max are nullish. Defaults to "—". */
  emptyFallback?: string;
}

const suffixFor = (budgetType: BudgetType): string => {
  if (budgetType === "annual") return "/yr";
  if (budgetType === "monthly") return "/mo";
  if (budgetType === "hourly") return "/hr";
  return "";
};

/** Format a single amount in the given currency. Falls back to a manual symbol
 *  if Intl rejects the currency code. */
function formatAmount(amount: number, currency: string): string {
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  } catch {
    const symbol = SYMBOL_BY_CODE.get(currency) ?? currency + " ";
    return `${symbol}${amount.toLocaleString("en-US", { maximumFractionDigits: 0 })}`;
  }
}

/** Render a budget range like "₹50,000–₹80,000/mo" or "$60/hr".
 *  Returns `opts.emptyFallback` (default "—") if both bounds are missing. */
export function formatBudget(
  min: number | null | undefined,
  max: number | null | undefined,
  currency: string | null | undefined = "USD",
  budgetType: BudgetType = "hourly",
  opts: FormatBudgetOptions = {},
): string {
  const cur = (currency ?? "USD").toUpperCase();
  const fromCents = opts.fromCents ?? false;
  const empty = opts.emptyFallback ?? "—";

  const toAmount = (v: number | null | undefined) =>
    v == null ? null : fromCents ? v / 100 : v;

  const lo = toAmount(min);
  const hi = toAmount(max);

  if (lo == null && hi == null) return empty;

  const suffix = suffixFor(budgetType);

  if (lo != null && hi != null) {
    return `${formatAmount(lo, cur)}–${formatAmount(hi, cur)}${suffix}`;
  }
  if (lo != null) return `${formatAmount(lo, cur)}+${suffix}`;
  return `up to ${formatAmount(hi!, cur)}${suffix}`;
}
