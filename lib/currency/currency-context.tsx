"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import {
  DISPLAY_CURRENCIES,
  type DisplayCurrencyCode,
} from "./currencies";

const STORAGE_KEY = "octoglehire-display-currency";
const DEFAULT_CURRENCY: DisplayCurrencyCode = "USD";

/** Currencies where fractional units are not used or values are typically large */
const ZERO_DECIMAL_CURRENCIES: string[] = ["JPY", "KRW", "VND", "IDR"];

/** Currencies that tend to have high numeric values per unit of foreign currency */
const HIGH_VALUE_CURRENCIES: string[] = ["JPY", "INR", "IDR", "KRW", "VND"];

type ExchangeRates = Record<string, number>;

interface CurrencyContextValue {
  displayCurrency: DisplayCurrencyCode;
  setDisplayCurrency: (code: DisplayCurrencyCode) => void;
  convert: (amount: number, fromCurrency: string) => number;
  formatAmount: (amount: number, fromCurrency: string) => string;
  rates: ExchangeRates;
  loading: boolean;
}

const CurrencyContext = createContext<CurrencyContextValue | null>(null);

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [displayCurrency, setDisplayCurrencyState] =
    useState<DisplayCurrencyCode>(DEFAULT_CURRENCY);
  const [rates, setRates] = useState<ExchangeRates>({});
  const [loading, setLoading] = useState(true);

  // Load saved currency from localStorage after mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (
        stored &&
        DISPLAY_CURRENCIES.some((c) => c.code === stored)
      ) {
        setDisplayCurrencyState(stored as DisplayCurrencyCode);
      }
    } catch {
      // localStorage unavailable — keep default
    }
  }, []);

  // Fetch exchange rates whenever the display currency changes
  useEffect(() => {
    let cancelled = false;

    async function fetchRates() {
      setLoading(true);
      try {
        const base =
          process.env.NEXT_PUBLIC_API_BASE_URL ?? "";
        const res = await fetch(
          `${base}/api/public/exchange-rates?base=${displayCurrency}`
        );
        if (!res.ok) throw new Error("Failed to fetch rates");
        const data = await res.json();
        if (!cancelled) {
          // Expect { rates: { USD: 1, EUR: 0.92, ... } } or flat object
          setRates(data.rates ?? data);
        }
      } catch {
        // On error keep stale rates (or empty)
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchRates();
    return () => {
      cancelled = true;
    };
  }, [displayCurrency]);

  const setDisplayCurrency = useCallback(
    (code: DisplayCurrencyCode) => {
      setDisplayCurrencyState(code);
      try {
        localStorage.setItem(STORAGE_KEY, code);
      } catch {
        // localStorage unavailable
      }
    },
    []
  );

  const convert = useCallback(
    (amount: number, fromCurrency: string): number => {
      if (fromCurrency === displayCurrency) return amount;

      const fromRate = rates[fromCurrency];
      if (!fromRate || fromRate === 0) return amount;

      // rates are relative to displayCurrency as base, so:
      // 1 displayCurrency = fromRate fromCurrency
      // amount in fromCurrency = amount / fromRate in displayCurrency
      const converted = amount / fromRate;

      // Smart rounding
      if (HIGH_VALUE_CURRENCIES.includes(displayCurrency)) {
        return Math.round(converted);
      }
      if (converted >= 100) {
        return Math.round(converted);
      }
      return Math.round(converted * 100) / 100;
    },
    [rates, displayCurrency]
  );

  const formatAmount = useCallback(
    (amount: number, fromCurrency: string): string => {
      const converted = convert(amount, fromCurrency);
      const abs = Math.abs(converted);
      const isZeroDecimal = ZERO_DECIMAL_CURRENCIES.includes(displayCurrency);

      let maximumFractionDigits: number;
      let minimumFractionDigits: number;

      if (abs >= 1000) {
        maximumFractionDigits = 0;
        minimumFractionDigits = 0;
      } else if (abs >= 1) {
        if (isZeroDecimal) {
          maximumFractionDigits = 0;
          minimumFractionDigits = 0;
        } else {
          maximumFractionDigits = 2;
          minimumFractionDigits = 2;
        }
      } else {
        maximumFractionDigits = 2;
        minimumFractionDigits = 2;
      }

      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: displayCurrency,
        maximumFractionDigits,
        minimumFractionDigits,
      }).format(converted);
    },
    [convert, displayCurrency]
  );

  const value = useMemo<CurrencyContextValue>(
    () => ({
      displayCurrency,
      setDisplayCurrency,
      convert,
      formatAmount,
      rates,
      loading,
    }),
    [displayCurrency, setDisplayCurrency, convert, formatAmount, rates, loading]
  );

  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency(): CurrencyContextValue {
  const ctx = useContext(CurrencyContext);
  if (!ctx) {
    throw new Error("useCurrency must be used within a CurrencyProvider");
  }
  return ctx;
}
