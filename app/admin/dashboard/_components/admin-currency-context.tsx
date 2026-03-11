"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import { useExchangeRates } from "@/lib/hooks/use-exchange-rates";
import { formatCurrency } from "./dashboard-data";

type DisplayCurrency = "USD" | "GBP" | "AED";

interface AdminCurrencyContextValue {
  displayCurrency: DisplayCurrency;
  setDisplayCurrency: (currency: DisplayCurrency) => void;
  convert: (amount: number, fromCurrency: string) => number;
  formatDisplay: (amount: number, fromCurrency: string) => string;
  rates: Record<string, number>;
  loading: boolean;
}

const AdminCurrencyContext = createContext<AdminCurrencyContextValue | null>(
  null,
);

export function AdminCurrencyProvider({
  children,
  token,
}: {
  children: ReactNode;
  token: string | null;
}) {
  const [displayCurrency, setDisplayCurrency] = useState<DisplayCurrency>("USD");
  const { rates, loading } = useExchangeRates(displayCurrency, token);

  const convert = useCallback(
    (amount: number, fromCurrency: string): number => {
      if (fromCurrency === displayCurrency) return amount;

      // rates are relative to displayCurrency as base
      // e.g. if displayCurrency=GBP, rates = { GBP:1, USD:1.27, EUR:1.17, AED:4.66 }
      // To convert FROM USD TO GBP: amount / rates["USD"]
      const fromRate = rates[fromCurrency];
      if (!fromRate) return amount;
      return amount / fromRate;
    },
    [rates, displayCurrency],
  );

  const formatDisplay = useCallback(
    (amount: number, fromCurrency: string): string => {
      const converted = convert(amount, fromCurrency);
      return formatCurrency(converted, displayCurrency);
    },
    [convert, displayCurrency],
  );

  return (
    <AdminCurrencyContext.Provider
      value={{
        displayCurrency,
        setDisplayCurrency,
        convert,
        formatDisplay,
        rates,
        loading,
      }}
    >
      {children}
    </AdminCurrencyContext.Provider>
  );
}

export function useAdminCurrency() {
  const ctx = useContext(AdminCurrencyContext);
  if (!ctx) {
    throw new Error(
      "useAdminCurrency must be used within AdminCurrencyProvider",
    );
  }
  return ctx;
}
