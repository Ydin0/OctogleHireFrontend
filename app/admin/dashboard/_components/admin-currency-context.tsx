"use client";

import { type ReactNode } from "react";
import { useCurrency } from "@/lib/currency";
import { formatCurrency } from "./dashboard-data";

/**
 * Legacy wrapper — delegates to the global CurrencyProvider.
 * Kept so existing admin components using useAdminCurrency() still work.
 */
export function AdminCurrencyProvider({
  children,
}: {
  children: ReactNode;
  token?: string | null;
}) {
  return <>{children}</>;
}

export function useAdminCurrency() {
  const {
    displayCurrency,
    setDisplayCurrency,
    convert,
    formatAmount,
    rates,
    loading,
  } = useCurrency();

  // formatDisplay matches the old API: convert + format with admin formatCurrency
  const formatDisplay = (amount: number, fromCurrency: string): string => {
    const converted = convert(amount, fromCurrency);
    return formatCurrency(converted, displayCurrency);
  };

  return {
    displayCurrency,
    setDisplayCurrency: setDisplayCurrency as (currency: string) => void,
    convert,
    formatDisplay,
    formatAmount,
    rates,
    loading,
  };
}
